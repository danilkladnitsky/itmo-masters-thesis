import os
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from transformers import get_linear_schedule_with_warmup
from sklearn.model_selection import train_test_split
import numpy as np
from tqdm import tqdm
import logging
import boto3
import tempfile
import json

logger = logging.getLogger(__name__)

class ChineseTextDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]

        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

class ChineseBERTTrainer:
    def __init__(self, model_name="bert-base-chinese", num_labels=2):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model_name = model_name
        self.num_labels = num_labels
        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.model = BertForSequenceClassification.from_pretrained(
            model_name,
            num_labels=num_labels
        ).to(self.device)
        
        # Initialize S3 client
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('S3_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('S3_SECRET_ACCESS_KEY'),
            region_name=os.getenv('S3_REGION', 'us-east-1')
        )

    def download_and_prepare_data(self, bucket: str, prefix: str):
        """Download and prepare data from S3."""
        try:
            # Create temporary directory for downloaded files
            with tempfile.TemporaryDirectory() as temp_dir:
                # List and download files
                response = self.s3_client.list_objects_v2(
                    Bucket=bucket,
                    Prefix=prefix
                )
                
                texts = []
                labels = []
                
                for obj in response.get('Contents', []):
                    if obj['Key'].endswith('.txt'):
                        # Download file
                        local_path = os.path.join(temp_dir, os.path.basename(obj['Key']))
                        self.s3_client.download_file(bucket, obj['Key'], local_path)
                        
                        # Read and process file
                        with open(local_path, 'r', encoding='utf-8') as f:
                            for line in f:
                                try:
                                    data = json.loads(line.strip())
                                    texts.append(data['text'])
                                    labels.append(data['label'])
                                except json.JSONDecodeError:
                                    logger.warning(f"Skipping invalid JSON line in {obj['Key']}")
                                except KeyError:
                                    logger.warning(f"Skipping line with missing fields in {obj['Key']}")
                
                return texts, labels
                
        except Exception as e:
            logger.error(f"Error preparing data: {str(e)}")
            raise

    def train(self, texts, labels, output_dir, batch_size=16, epochs=3, learning_rate=2e-5):
        """Train the model."""
        try:
            # Split data
            train_texts, val_texts, train_labels, val_labels = train_test_split(
                texts, labels, test_size=0.1, random_state=42
            )

            # Create datasets
            train_dataset = ChineseTextDataset(train_texts, train_labels, self.tokenizer)
            val_dataset = ChineseTextDataset(val_texts, val_labels, self.tokenizer)

            # Create dataloaders
            train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
            val_dataloader = DataLoader(val_dataset, batch_size=batch_size)

            # Setup optimizer and scheduler
            optimizer = AdamW(self.model.parameters(), lr=learning_rate)
            total_steps = len(train_dataloader) * epochs
            scheduler = get_linear_schedule_with_warmup(
                optimizer,
                num_warmup_steps=0,
                num_training_steps=total_steps
            )

            # Training loop
            best_val_loss = float('inf')
            for epoch in range(epochs):
                logger.info(f"Epoch {epoch + 1}/{epochs}")
                
                # Training
                self.model.train()
                total_train_loss = 0
                for batch in tqdm(train_dataloader, desc="Training"):
                    input_ids = batch['input_ids'].to(self.device)
                    attention_mask = batch['attention_mask'].to(self.device)
                    labels = batch['labels'].to(self.device)

                    self.model.zero_grad()
                    outputs = self.model(
                        input_ids=input_ids,
                        attention_mask=attention_mask,
                        labels=labels
                    )

                    loss = outputs.loss
                    total_train_loss += loss.item()
                    loss.backward()
                    torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
                    optimizer.step()
                    scheduler.step()

                avg_train_loss = total_train_loss / len(train_dataloader)
                logger.info(f"Average training loss: {avg_train_loss}")

                # Validation
                self.model.eval()
                total_val_loss = 0
                for batch in tqdm(val_dataloader, desc="Validation"):
                    with torch.no_grad():
                        input_ids = batch['input_ids'].to(self.device)
                        attention_mask = batch['attention_mask'].to(self.device)
                        labels = batch['labels'].to(self.device)

                        outputs = self.model(
                            input_ids=input_ids,
                            attention_mask=attention_mask,
                            labels=labels
                        )
                        total_val_loss += outputs.loss.item()

                avg_val_loss = total_val_loss / len(val_dataloader)
                logger.info(f"Average validation loss: {avg_val_loss}")

                # Save best model
                if avg_val_loss < best_val_loss:
                    best_val_loss = avg_val_loss
                    self.model.save_pretrained(output_dir)
                    self.tokenizer.save_pretrained(output_dir)
                    logger.info(f"Saved best model to {output_dir}")

            return {
                "status": "success",
                "final_train_loss": avg_train_loss,
                "final_val_loss": avg_val_loss,
                "model_path": output_dir
            }

        except Exception as e:
            logger.error(f"Error during training: {str(e)}")
            raise

    def save_model_to_s3(self, local_path: str, bucket: str, prefix: str):
        """Save the trained model to S3."""
        try:
            for root, dirs, files in os.walk(local_path):
                for file in files:
                    local_file_path = os.path.join(root, file)
                    s3_key = os.path.join(prefix, os.path.relpath(local_file_path, local_path))
                    
                    self.s3_client.upload_file(local_file_path, bucket, s3_key)
                    logger.info(f"Uploaded {local_file_path} to s3://{bucket}/{s3_key}")
            
            return True
        except Exception as e:
            logger.error(f"Error saving model to S3: {str(e)}")
            raise

from transformers import GPT2LMHeadModel, AutoTokenizer
import torch
import re

def sanitize_sentence(text: str) -> str:
    """Extract content after first full-width colon up to first sentence-ending punctuation."""
    match = re.search(r"：(.+?[。！？])", text)
    if match:
        return match.group(1).strip()
    return text.strip()

class ChineseSentenceGenerator:
    def __init__(self, model_path: str, device: str = None):
        print(f"Loading model from {model_path}")
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = GPT2LMHeadModel.from_pretrained(model_path)

        self.model.eval()
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        self.model.config.pad_token_id = self.tokenizer.pad_token_id
        self.model.config.eos_token_id = self.tokenizer.eos_token_id

    def generate(self, word: str, max_length: int = 60, num_return_sequences: int = 1) -> list:
        prompt = f"请用词语“{word}”造句："
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)

        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_length=max_length,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.9,
                num_return_sequences=num_return_sequences,
                pad_token_id=self.model.config.pad_token_id,
                eos_token_id=self.model.config.eos_token_id,
                repetition_penalty=1.3
            )

        results = []
        for output in outputs:
            decoded = self.tokenizer.decode(output, skip_special_tokens=True)
            decoded = decoded.replace(" ", "")
            sentence = sanitize_sentence(decoded)
            results.append(sentence)

        return results
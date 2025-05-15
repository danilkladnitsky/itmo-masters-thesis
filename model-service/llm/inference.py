from transformers import GPT2LMHeadModel, AutoTokenizer
import torch
import re

def sanitize_sentence(text: str) -> str:
    """
    Extract content starting from first full-width colon (`：`) to first Chinese punctuation like `。`, `！`, or `？`.
    """
    # Match everything from first ： to the first 。 or ! or ?
    match = re.search(r"：(.+?[。！？])", text)
    if match:
        return match.group(1).strip()
    return text.strip()  # fallback: return entire string if pattern not found


class ChineseSentenceGenerator:
    def __init__(self, model_name: str, device: str = None):
        path = f"../models/{model_name}"
        self.tokenizer = AutoTokenizer.from_pretrained(path)
        self.model = GPT2LMHeadModel.from_pretrained(path)

        self.model.eval()
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

        # Ensure pad token is defined
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model.config.pad_token_id = self.tokenizer.pad_token_id
            self.model.config.eos_token_id = self.tokenizer.eos_token_id

    def generate(self, word: str, max_length: int = 60, num_return_sequences: int = 1) -> list:
        prompt = f"输入词语：{word}。生成句子:"
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)

        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_length=max_length,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.5,
                num_return_sequences=num_return_sequences,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                repetition_penalty=1.2
            )

        results = []
        for output in outputs:
            decoded = self.tokenizer.decode(output, skip_special_tokens=True)
            # remove all spaces
            decoded = decoded.replace(" ", "")
            print(decoded)
            sentence = sanitize_sentence(decoded)
            results.append(sentence)

        return results
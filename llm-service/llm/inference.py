from transformers import GPT2LMHeadModel, AutoTokenizer, BertTokenizerFast, PreTrainedTokenizer
import torch
import re
import os
def sanitize_sentence(text: str) -> str:
    """Extract content after first full-width colon up to first sentence-ending punctuation."""
    match = re.search(r"：(.+?[。！？])", text)
    if match:
        return match.group(1).strip()
    return text.strip()

def clean_output(text: str) -> str:
    # Remove all whitespace
    no_space = re.sub(r"\s+", "", text)

    # Extract everything after '造句：'
    match = re.search(r"造句[:：](.+)", no_space)
    if match:
        sentence = match.group(1)
        # Optionally stop at first full stop / punctuation
        sentence = re.split(r"[。！？]", sentence)[0] + "。"
        return sentence

    return no_space  # fallback if no match

class ChineseSentenceGenerator:
    def __init__(self, model_path: str, device: str = None):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = GPT2LMHeadModel.from_pretrained(model_path)

        self.model.eval()
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

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
                top_p=0.9,
                temperature=0.8,
                num_return_sequences=num_return_sequences,
                repetition_penalty=1.3,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )

        print(self.tokenizer.pad_token_id, self.tokenizer.eos_token_id)

        results = []
        for output in outputs:
            decoded = self.tokenizer.decode(output, skip_special_tokens=True)
            sentence = decoded.replace(prompt, "").replace(" ", "").strip()
            sentence = re.split(r"[。！？]", sentence)[0] + "。"
            # remove all spaces
            sentence = sentence.replace(" ", "")
            results.append(clean_output(sentence))

        return results
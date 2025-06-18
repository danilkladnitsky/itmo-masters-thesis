import json
import random
import requests

PATH_TO_WORD_BUNDLES = "data/word_bundles.json"
MAX_WORDS_IN_TASK = 10
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen3:0.6b"

class GapTaskService:
    def __init__(self):
        self.word_bundles = self.get_word_bundles()

    def get_word_bundles(self):
        with open(PATH_TO_WORD_BUNDLES, "r") as f:
            return json.load(f)

    def get_words_list(self, bundles_ids: list[int]):
        words_list = []
        for bundle_id in bundles_ids:
            words_list.extend(self.word_bundles[bundle_id]["words"])
        return words_list

    def generate_sentence_with_word(self, word: str) -> str:
        # /no_think 请用词语“跑步”造一个句子，只使用 HSK 1 级词汇，并且只写一句话。
        prompt = f"请用词语“{word}”造一个句子，只使用 HSK 1 级词汇，句子中不少于五个词，并且只写一句话。"
        response = requests.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "think": False
        })
        response.raise_for_status()
        return response.json()["response"].strip()

    def generate_gap_task(self, bundles_ids: list[int]):
        words = self.get_words_list(bundles_ids)
        selected_words = random.sample(words, min(MAX_WORDS_IN_TASK, len(words)))

        gap_tasks = []

        for word in selected_words:
            sentence = self.generate_sentence_with_word(word)
            tokens = sentence.split()
            if word in tokens:
                gap_sentence = sentence.replace(word, "____", 1)
            else:
                # Try a fuzzy match or fallback
                gap_sentence = sentence.replace(word[0], "____", 1)

            gap_tasks.append({
                "word": word,
                "original": sentence,
                "gap_sentence": gap_sentence
            })

        return gap_tasks
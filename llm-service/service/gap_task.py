import json
import random

PATH_TO_WORD_BUNDLES = "data/word_bundles.json"
PATH_TO_MOCK_RESPONSES = "data/mock_responses.json"

MAX_WORDS_IN_TASK = 10

class GapTaskService:

    def __init__(self):
        self.word_bundles = self.get_word_bundles()\

    def get_word_bundles(self):
        with open(PATH_TO_WORD_BUNDLES, "r") as f:
            return json.load(f)

    def get_words_list(self, bundles_ids: list[int]):
        words_list = []
        for bundle_id in bundles_ids:
            words_list.extend(self.word_bundles[bundle_id]["words"])
        return words_list

    def generate_gap_task(self, bundles_ids: list[int]):
        words_list = self.get_words_list(bundles_ids)
        # Take either MAX_WORDS_IN_TASK or all available words, whichever is smaller
        num_words = min(len(words_list), MAX_WORDS_IN_TASK)
        words_list = random.sample(words_list, num_words)
        print(words_list)

        # 2. generate a sentence with the word
        # 3. tokenize the sentence and divide into words
        # 4. select a random word from the sentence and replace it with a gap
        with open(PATH_TO_MOCK_RESPONSES, "r") as f:
            mock_responses = json.load(f)
        return mock_responses

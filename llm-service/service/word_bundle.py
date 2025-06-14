import json

PATH_TO_WORD_BUNDLES = "data/word_bundles.json"
PATH_TO_HSK1_WORD_GROUPS = "data/hsk1_word_groups.json"


class WordBundleService:
    def __init__(self):
        pass

    def get_word_bundles(self):
        with open(PATH_TO_WORD_BUNDLES, "r") as f:
            return json.load(f)
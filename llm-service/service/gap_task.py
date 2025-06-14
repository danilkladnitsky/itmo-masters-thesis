

class GapTaskService:
    def __init__(self, model_path: str):
        self.model_path = model_path

    def generate_gap_task(self, model_name: str, hsk_level: int):
        # 1. select a random word from vocabulary but with high frequency of usage
        # 2. generate a sentence with the word
        # 3. tokenize the sentence and divide into words
        # 4. select a random word from the sentence and replace it with a gap
        pass
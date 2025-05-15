import { FillGapsWidget } from '../../widgets/FillGapsWidget/FillGapsWidget';
import { useGenerateGapsTask } from '../../api/hooks/useGenerateGapsTask';
import { useCallback, useState } from 'react';
import { Button } from '@gravity-ui/uikit';

const HSK_1_WORDS = [
  "很", "你", "她", "我们", "他", "这", "有", "在", "想", "不",
  "去", "今天", "现在", "喜欢", "昨天", "什么", "吗", "吃", "明天", "说",
  "没有", "我", "那", "认识", "和", "请", "谁", "怎么", "都", "会",
  "的", "是", "朋友"
];

export const FillGapsPage = () => {
  const { mutateAsync: generateGapsTask, isPending } = useGenerateGapsTask();

  const [sentence, setSentence] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [modelName, setModelName] = useState('hsk1-gpt2-jieba');
  const [answer, setAnswer] = useState('');
  const [rightAnswer, setRightAnswer] = useState<string>('');
  const [isError, setIsError] = useState(false);

  const generateTask = useCallback(async (word: string) => {
    const response = await generateGapsTask({
      inference_model_name: modelName,
      word: word,
    });

    setSentence(response.sentence_with_gap);
    setOptions(response.options);
    setRightAnswer(response.answer);
    setIsError(false);
    setAnswer('');
  }, [modelName]);

  const handleSubmit = async (word: string) => {
    if (word !== rightAnswer) {
      setIsError(true);
      setAnswer('');
      return;
    }

    generateTask(HSK_1_WORDS[Math.floor(Math.random() * HSK_1_WORDS.length)]);
  };

  const handleStart = () => {
    const nextRandomWord = HSK_1_WORDS[Math.floor(Math.random() * HSK_1_WORDS.length)];
    generateTask(nextRandomWord)
  }

  if (!rightAnswer) {
    return <div>
      <Button isLoading={isPending} size='xl' view='action' onClick={handleStart}>
        Let's goooo
      </Button>
    </div>
  }


  return (
    <FillGapsWidget
      answer={answer}
      setAnswer={setAnswer}
      modelName={modelName}
      isLoading={isPending}
      sentence={sentence}
      options={options}
      onSubmit={handleSubmit}
      isError={isError}
    />
  );
};

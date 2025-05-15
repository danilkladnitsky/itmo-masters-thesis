import { FillGapsWidget } from '../../widgets/FillGapsWidget/FillGapsWidget';
import { useGenerateGapsTask } from '../../api/hooks/useGenerateGapsTask';
import { useEffect, useState } from 'react';

const HSK_1_WORDS = ["今天", "现在", "喜欢", "昨天", "什么", "吗", "吃", "明天", "说", "没有", "我", "那", "认识", "和", "请", "谁", "怎么", "很", "你", "她", "我们", "他", "这", "有", "在", "想", "不", "去", "书", "茶", "酒店", "咖啡", "酒", "啡"];

export const FillGapsPage = () => {
    const { mutateAsync: generateGapsTask, isPending } = useGenerateGapsTask();

    const [sentence, setSentence] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [modelName, setModelName] = useState('hsk1-gpt2-jieba-2');
    const [answer, setAnswer] = useState('');

    const handleSubmit = async (word: string) => {
        try {
            const nextRandomWord = HSK_1_WORDS[Math.floor(Math.random() * HSK_1_WORDS.length)];
            
            const response = await generateGapsTask({
            model_name: modelName,
            word: nextRandomWord,
          });
          setAnswer("");
    
          if (response.status === 'success') {
            setSentence(response.sentence_with_gap);
            setOptions(response.options);
          }
        } catch (err) {
          console.error('Error generating task:', err);
        }
      };

    useEffect(() => {
        handleSubmit(HSK_1_WORDS[Math.floor(Math.random() * HSK_1_WORDS.length)]);
    }, []);

    return (
        <FillGapsWidget
            answer={answer}
            setAnswer={setAnswer}
            modelName={modelName}
            isLoading={isPending}
            sentence={sentence}
            options={options}
            onSubmit={handleSubmit}
        />
    );
};

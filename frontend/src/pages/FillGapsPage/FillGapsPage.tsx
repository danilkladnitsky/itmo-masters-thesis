import { FillGapsWidget } from '../../widgets/FillGapsWidget/FillGapsWidget';
import { useGenerateGapsTask } from '../../api/hooks/useGenerateGapsTask';

export const FillGapsPage = () => {
    const { mutate: generateGapsTask, isPending } = useGenerateGapsTask();


    const handleSubmit = () => {
        generateGapsTask({
            model_name: 'hsk1-gpt2-jieba-2',
            word: '书',
        });
    };

    return (
        <FillGapsWidget
            isLoading={isPending}
            sentence="我喜欢喝_"
            options={['书', '茶', '酒店', '咖啡', '酒', '啡']}
            onSubmit={handleSubmit}
        />
    );
};

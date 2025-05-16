import styled from '@emotion/styled';
import { Button, Text } from '@gravity-ui/uikit';

interface FillGapsWidgetProps {
    sentence: string;
    options: string[];
    onSubmit: (text: string) => void;
    isLoading: boolean;
    modelName: string;
    answer: string;
    setAnswer: (text: string) => void;
    isError: boolean;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    width: 500px;
    height: 500px;
    margin: 0 auto;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const SentenceContainer = styled.div`
    font-size: 48px !important;
    line-height: 1.5;
    text-align: center;
`;

const Gap = styled.span`
    display: inline-block;
    height: 80px;
    border-bottom: 2px solid #333;
    margin: 0 8px;
    vertical-align: middle;
    min-width: 44px;
`;

const OptionsContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: flex-end;
    justify-content: center;
    flex: 1 1;
`;

const OptionButton = styled(Button)`
    font-size: 20px;
`;

const SubmitButton = styled(Button)`
    width: 100%;
`;


export const FillGapsWidget = ({ sentence, options, onSubmit, isLoading, modelName, answer, setAnswer, isError }: FillGapsWidgetProps) => {
    const handleOptionClick = (option: string) => {
        setAnswer(option);
    };

    const handleSubmit = () => {
        if (answer) {
            onSubmit(answer);
        }
    };

    const parts = sentence.split('_');

    return (
        <Container>
            <Text variant="caption-2">model: {modelName}</Text>
            <Text variant="body-3">Вставьте пропуск в предложении:</Text>
            <SentenceContainer>
                {parts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < parts.length - 1 && <Gap>{answer || ''}</Gap>}
                    </span>
                ))}
            </SentenceContainer>
            <OptionsContainer>
                {options.map((option) => (
                    <OptionButton
                        key={option}
                        isSelected={answer === option}
                        onClick={() => handleOptionClick(option)}
                        size="xl"
                        view="outlined"
                        loading={isLoading}
                    >
                        <span>{option}</span>
                    </OptionButton>
                ))}
            </OptionsContainer>
            <SubmitButton
                width="max"
                disabled={!answer}
                size="xl"
                view='action'
                onClick={handleSubmit}
                loading={isLoading}
            >
                {isError ? 'Попробовать снова' : 'Дальше'}
            </SubmitButton>
        </Container>
    );
};

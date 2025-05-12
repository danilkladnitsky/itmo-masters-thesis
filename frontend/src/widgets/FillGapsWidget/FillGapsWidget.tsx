import {Progress} from '../../components/Progress/Progress';
import styled from '@emotion/styled';
import {Button, Text} from '@gravity-ui/uikit';
import {useState} from 'react';

interface FillGapsWidgetProps {
    sentence: string;
    options: string[];
    onSubmit: (text: string) => void;
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

const ProgressContainer = styled.div`
    width: 100%;
    flex: 1 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
`;

export const FillGapsWidget = ({sentence, options, onSubmit}: FillGapsWidgetProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (selectedOption) {
            onSubmit(selectedOption);
        }
    };

    const parts = sentence.split('_');

    return (
        <Container>
            <ProgressContainer>
                <Text variant="body-1">model: bert_hsk3</Text>
                <Progress />
            </ProgressContainer>
            <Text variant="body-3">Вставьте пропуск в предложении:</Text>
            <SentenceContainer>
                {parts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < parts.length - 1 && <Gap>{selectedOption}</Gap>}
                    </span>
                ))}
            </SentenceContainer>
            <OptionsContainer>
                {options.map((option) => (
                    <OptionButton
                        key={option}
                        isSelected={selectedOption === option}
                        onClick={() => handleOptionClick(option)}
                        size="xl"
                        view="outlined"
                    >
                        <span>{option}</span>
                    </OptionButton>
                ))}
            </OptionsContainer>
            <SubmitButton
                width="max"
                disabled={!selectedOption}
                size="xl"
                view="action"
                onClick={handleSubmit}
            >
                Дальше
            </SubmitButton>
        </Container>
    );
};

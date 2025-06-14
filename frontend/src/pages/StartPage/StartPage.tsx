import { Button, Icon, Select } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';
import { ListCheck, TextAlignLeft } from '@gravity-ui/icons';
import { useState } from 'react';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--g-color-base-background);
`;

const Content = styled.div`
    text-align: center;
`;

const Title = styled.h1`
    font-size: 24px;
    color: var(--g-color-text-primary);
`;

const SelectContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    margin-bottom: 24px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 16px;
    
    button {
        min-width: 200px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const StartPage = () => {
    const navigate = useNavigate();
    const [selectedTask, setSelectedTask] = useState<string>('hsk_1');

    const handleTaskSelect = (taskType: 'sentence' | 'test') => {
        navigate(`/${taskType}-generator`);
    };

    return (
        <Container>
            <Content>
                <SelectContainer>
                    <Title>Выберите тип задачи</Title>
                    <Select
                        placeholder="HSK 1"
                        options={[
                            { value: 'hsk_1', content: 'HSK 1' },
                            { value: 'hsk_2', content: 'HSK 2' },
                            { value: 'hsk_3', content: 'HSK 3' },
                            { value: 'hsk_4', content: 'HSK 4' },
                        ]}
                    />
                </SelectContainer>
                <ButtonsContainer>
                    <Button
                        size="xl"
                        onClick={() => handleTaskSelect('sentence')}
                    >
                        Генератор предложений
                        <Icon data={TextAlignLeft} />
                    </Button>
                    <Button
                        size="xl"
                        onClick={() => handleTaskSelect('test')}
                    >
                        Генератор тестов
                        <Icon data={ListCheck} />
                    </Button>
                </ButtonsContainer>
            </Content>
        </Container>
    );
};

import { Button, Icon } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';
import { ListCheck, TextAlignLeft } from '@gravity-ui/icons';

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
    margin-bottom: 32px;
    font-size: 24px;
    color: var(--g-color-text-primary);
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

    const handleTaskSelect = (taskType: 'sentence' | 'test') => {
        navigate(`/${taskType}-generator`);
    };

    return (
        <Container>
            <Content>
                <Title>Выберите тип задачи</Title>
                <ButtonsContainer>
                    <Button
                        size="xl"
                        onClick={() => handleTaskSelect('sentence')}
                    >
                        Sentence Generator
                        <Icon data={TextAlignLeft} />
                    </Button>
                    <Button
                        size="xl"
                        onClick={() => handleTaskSelect('test')}
                    >
                        Test Generator
                        <Icon data={ListCheck} />
                    </Button>
                </ButtonsContainer>
            </Content>
        </Container>
    );
};

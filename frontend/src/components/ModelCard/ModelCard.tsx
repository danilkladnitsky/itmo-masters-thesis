import {Button, Card, Label, Text} from '@gravity-ui/uikit';
import styled from '@emotion/styled';
import {useNavigate} from 'react-router';

const CardStyled = styled(Card)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 300px;
`;

const ModelTagsStyled = styled.div`
    margin-top: 8px;
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
`;

export const ModelCard = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/task/1');
    };

    return (
        <CardStyled onClick={handleClick}>
            <Text variant="subheader-1">Model name</Text>
            <Text variant="body-1">Model description</Text>
            <ModelTagsStyled>
                <Label>HSK 3</Label>
                <Label>Travel & Tourism</Label>
            </ModelTagsStyled>
            <Button view="normal" size="l" onClick={handleClick}>
                Выбрать
            </Button>
        </CardStyled>
    );
};

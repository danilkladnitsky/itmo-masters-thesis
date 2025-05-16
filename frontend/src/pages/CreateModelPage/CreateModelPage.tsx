import { Text } from '@gravity-ui/uikit';
import { CreateModelWidget } from '../../widgets/CreateModelWidget/CreateModelWidget';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const CreateModelPage = () => {
    return (
        <Container>
            <Text variant="header-2">Сбор датасета</Text>
            <CreateModelWidget />
        </Container>
    );
};

import styled from '@emotion/styled';
import {SelectModelWidget} from '../../widgets/SelectModelWidget/SelectModelWidget';
import {Text} from '@gravity-ui/uikit';

const ContainerStyled = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const SelectModelPage = () => {
    return (
        <ContainerStyled>
            <Text variant="header-1">Выберите модель</Text>
            <SelectModelWidget />
        </ContainerStyled>
    );
};

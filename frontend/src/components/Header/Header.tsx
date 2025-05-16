import styled from '@emotion/styled';
import { Text } from '@gravity-ui/uikit';

const HeaderStyled = styled.div`
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
    padding: 0 24px;
`;

export const Header = () => {
    return (
        <HeaderStyled>
            <Text variant="header-1"></Text>
        </HeaderStyled>
    );
};

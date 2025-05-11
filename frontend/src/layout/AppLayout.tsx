import styled from '@emotion/styled';

const AppLayoutStyled = styled.div`
    height: calc(100vh - 60px);
    width: 100vw;
`;

const ContainerStyled = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ContentStyled = styled.div`
    padding: 24px;
`;

export const AppLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <AppLayoutStyled>
            <ContainerStyled>
                <ContentStyled>{children}</ContentStyled>
            </ContainerStyled>
        </AppLayoutStyled>
    );
};

import {Progress as ProgressUI} from '@gravity-ui/uikit';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
    width: 100%;
`;

export const Progress = () => {
    return (
        <ProgressContainer>
            <ProgressUI theme="info" value={50} size="s" />
        </ProgressContainer>
    );
};

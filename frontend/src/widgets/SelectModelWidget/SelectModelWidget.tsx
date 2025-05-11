import {ModelCard} from '../../components/ModelCard/ModelCard';
import styled from '@emotion/styled';

const ListStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
`;

export const SelectModelWidget = () => {
    return (
        <ListStyled>
            {Array.from({length: 10}).map((_, index) => (
                <ModelCard key={index} />
            ))}
        </ListStyled>
    );
};

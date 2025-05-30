import styled from '@emotion/styled';
import {Button, RadioGroup, RadioGroupOption, Text, TextArea, TextInput} from '@gravity-ui/uikit';
import {ModelData} from '../../CreateModelWidget';

const FormStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 500px;
    max-width: 100%;
`;

const ModelNameStyled = styled(TextInput)``;

const SubmitButtonStyled = styled(Button)`
    margin-top: auto;
`;

const options: RadioGroupOption[] = [
    {value: '1', content: 'HSK 1'},
    {value: '2', content: 'HSK 2'},
    {value: '3', content: 'HSK 3'},
];

interface ModelInfoFormProps {
    modelData: Pick<ModelData, 'name' | 'description' | 'hskLevel'>;
    onFormChange: (modelData: Pick<ModelData, 'name' | 'description' | 'hskLevel'>) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const ModelInfoForm = ({
    modelData,
    onFormChange,
    onSubmit,
    isLoading = false,
}: ModelInfoFormProps) => {
    const handleChange = (key: keyof ModelData, value: string) => {
        onFormChange({...modelData, [key]: value});
    };

    return (
        <FormStyled>
            <Text variant="body-1" color="secondary">
                Введите информацию о новой модели
            </Text>
            <ModelNameStyled
                placeholder="Название модели"
                size="xl"
                value={modelData.name}
                onChange={(e) => handleChange('name', e.target.value)}
            />
            <TextArea
                value={modelData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                size="xl"
                placeholder="Описание модели"
                minRows={3}
                maxRows={6}
            />
            <RadioGroup
                size="l"
                options={options}
                value={modelData.hskLevel.toString()}
                onChange={(e) => handleChange('hskLevel', e.target.value)}
            />
            <SubmitButtonStyled
                size="xl"
                view="action"
                onClick={() => onSubmit()}
                disabled={isLoading}
                loading={isLoading}
            >
                Создать модель
            </SubmitButtonStyled>
        </FormStyled>
    );
};

import {Button, Text as GravityText, TextInput} from '@gravity-ui/uikit';
import {useState} from 'react';
import styled from '@emotion/styled';
import {v4 as uuidv4} from 'uuid';

export interface Prompt {
    id: string;
    text: string;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const PromptListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const PromptItemContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const PromptItem = ({
    prompt,
    onRemove,
    onTextChange,
}: {
    prompt: Prompt;
    onRemove: (id: string) => void;
    onTextChange: (id: string, text: string) => void;
}) => {
    return (
        <PromptItemContainer>
            <TextInput
                size="l"
                placeholder="Введите текст промпта"
                value={prompt.text}
                onChange={(e) => onTextChange(prompt.id, e.target.value)}
            />
            <Button size="l" view="flat-danger" onClick={() => onRemove(prompt.id)}>
                ✕
            </Button>
        </PromptItemContainer>
    );
};

const AddPromptButton = ({onClick}: {onClick: () => void}) => {
    return (
        <Button size="l" view="flat-action" onClick={onClick} width="max">
            Добавить промпт
        </Button>
    );
};

interface PromptListProps {
    onAddPrompts: (prompts: Prompt[]) => void;
}

export const PromptList = ({onAddPrompts}: PromptListProps) => {
    const [prompts, setPrompts] = useState<Prompt[]>([
        {
            id: uuidv4(),
            text: 'Сгенерируй 10 предложений про погоду',
        },
    ]);

    const handleAddPrompt = () => {
        const newPrompt: Prompt = {
            id: uuidv4(),
            text: 'Сгенерируй 10 предложений про ',
        };

        const state = [...prompts, newPrompt];

        setPrompts(state);
        onAddPrompts(state);
    };

    const handleRemovePrompt = (id: string) => {
        const state = prompts.filter((prompt) => prompt.id !== id);

        setPrompts(state);
        onAddPrompts(state);
    };

    const handleTextChange = (id: string, text: string) => {
        const state = prompts.map((prompt) => (prompt.id === id ? {...prompt, text} : prompt));

        setPrompts(state);
        onAddPrompts(state);
    };

    return (
        <Container>
            <GravityText variant="body-1" color="secondary">
                Добавьте текстовые промпты для обучения модели
            </GravityText>
            <PromptListContainer>
                {prompts.map((prompt) => (
                    <PromptItem
                        key={prompt.id}
                        prompt={prompt}
                        onRemove={handleRemovePrompt}
                        onTextChange={handleTextChange}
                    />
                ))}
            </PromptListContainer>

            <AddPromptButton onClick={handleAddPrompt} />
        </Container>
    );
};

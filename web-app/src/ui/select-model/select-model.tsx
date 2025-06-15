import { Box, Button, SegmentedControl, Stack, Text } from '@mantine/core';
import { useMemo, useState } from 'react';

import styles from './select-model.module.scss';

interface SelectModelProps {
    value: "api" | "local" | null;
    onSubmit: (value: "api" | "local") => void;
}

export const SelectModel = ({ value, onSubmit }: SelectModelProps) => {
    const [selectedValue, setSelectedValue] = useState<"api" | "local" | null>(value);

    const handleSubmit = () => {
        onSubmit(selectedValue as "api" | "local");
    }

    const data = useMemo(() => {
        return [{
            label: "API LLM",
            value: "api"
        }, {
            label: "Локальная LLM",
            value: "local"
        }];
    }, []);

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.content}>
                <Stack gap="xs" style={{ width: '100%', height: '100%' }}>
                    <Text size="lg" fw={500}>Выберите тип модели</Text>
                    <SegmentedControl
                        data={data}
                        value={selectedValue ?? undefined}
                        onChange={(value) => setSelectedValue(value as "api" | "local")}
                        fullWidth
                    />
                    <Button fullWidth onClick={handleSubmit}>Выбрать</Button>
                </Stack>
            </Box>
        </Box>
    )
}

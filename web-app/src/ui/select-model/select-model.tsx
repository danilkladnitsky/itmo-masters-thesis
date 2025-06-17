import { Box, Button, SegmentedControl, Stack, Text } from '@mantine/core';
import { useMemo, useState } from 'react';

import styles from './select-model.module.scss';

interface SelectModelProps {
    value: "api" | "local" | undefined;
    onSubmit: (value: "api" | "local") => void;
}

export const SelectModel = ({ value = undefined, onSubmit }: SelectModelProps) => {
    const [selectedValue, setSelectedValue] = useState<"api" | "local" | undefined>(value);

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
                        defaultValue=''
                        onChange={(value) => setSelectedValue(value as "api" | "local")}
                        fullWidth
                    />
                    <Button disabled={!selectedValue} fullWidth onClick={handleSubmit}>Выбрать</Button>
                </Stack>
            </Box>
        </Box>
    )
}

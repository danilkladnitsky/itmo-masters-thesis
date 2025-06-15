import { Box, Progress, Stack, Text } from '@mantine/core';
import type { InitProgressReport } from '@mlc-ai/web-llm';

import styles from './llm-engine-loader.module.scss';

interface LLMEngineLoaderProps {
    progressReport: InitProgressReport;
}

export const LLMEngineLoader = ({ progressReport }: LLMEngineLoaderProps) => {
    const value = progressReport.progress * 100;

    return (
        <Box className={styles.wrapper}>
            <Stack className={styles.stack} gap="sm" align="center">
                <Text className={styles.text} size="lg" fw={500}>{progressReport.text}</Text>
                <Progress classNames={{ root: styles.progressRoot }} color="green" animated size="lg" value={value} />
            </Stack>
        </Box>
    )
}

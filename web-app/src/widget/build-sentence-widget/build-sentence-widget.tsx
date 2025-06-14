import { Box, Stack, Text } from '@mantine/core'
import { motion } from 'motion/react'
import styles from './build-sentence-widget.module.scss'
import { SentenceWithGap } from '@/ui/sentence-with-gap/sentence-with-gap'
import { APP_CONFIG } from '@/config'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { TaskStepControl } from '@/ui/task-step-control/task-step-control'

// 我现在要吃饭
const SENTENCE = ['我', '现在', APP_CONFIG.GAP_CHARACTER, '要', '吃饭', '。']

export const BuildSentenceWidget = () => {
    return (
        <Box className={styles.wrapper}>
            <Stack justify='space-between' h='100%'>
                <ProgressBar value={50} currentStep={7} totalSteps={10} onClose={() => { }} />
                <Box className={styles.taskWrapper}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0 }}
                    >
                        <Text className={styles.taskTitle}>Подберите слово, чтобы составить предложение:</Text>
                    </motion.div>
                    <Box className={styles.sentenceWrapper}>
                        <SentenceWithGap sentence={SENTENCE} />
                    </Box>
                </Box>
                <TaskStepControl />
            </Stack>
        </Box>
    )
}

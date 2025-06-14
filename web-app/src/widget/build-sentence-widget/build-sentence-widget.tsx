import { Box, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core'
import { motion } from 'motion/react'
import styles from './build-sentence-widget.module.scss'
import { SentenceWithGap } from '@/ui/sentence-with-gap/sentence-with-gap'
import { ProgressBar } from '@/ui/progress-bar/progress-bar'
import { TaskStepControl } from '@/ui/task-step-control/task-step-control'
import { WordCard } from '@/ui/word-card/word-card'


interface BuildSentenceWidgetProps {
    isLoading: boolean
    solveStatus: 'correct' | 'incorrect' | 'pending'
    sentence: string[]
    options: {
        word: string
        image: string
    }[]
    selectedWord: string | null
    currentStep: number
    totalSteps: number
    onSelect: (word: string) => void
    onBack: () => void
    onWordSubmit: () => void
}

export const BuildSentenceWidget = ({ isLoading, solveStatus = 'pending', sentence, options, selectedWord, currentStep, totalSteps, onSelect, onBack, onWordSubmit }: BuildSentenceWidgetProps) => {
    if (isLoading) {
        return <Box className={styles.wrapper}>
            <Stack h='100%' gap={48}>
                <ProgressBar isLoading={isLoading} value={currentStep / totalSteps * 100} currentStep={currentStep} totalSteps={totalSteps} onClose={() => { }} />
                <Skeleton height={100} />
                <SimpleGrid cols={2} spacing={8}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} height={150} />
                    ))}
                </SimpleGrid>
            </Stack>
        </Box>
    }


    return (
        <Box className={styles.wrapper}>
            <Stack justify='space-between' h='100%'>
                <ProgressBar value={currentStep / totalSteps * 100} currentStep={currentStep} totalSteps={totalSteps} onClose={() => { }} />
                <Box className={styles.taskWrapper}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0 }}
                    >
                        <Text className={styles.taskTitle}>Подберите слово, чтобы составить предложение:</Text>
                    </motion.div>
                    <Box className={styles.sentenceWrapper}>
                        <SentenceWithGap solveStatus={solveStatus} sentence={sentence} />
                    </Box>
                    <Box className={styles.options}>
                        <SimpleGrid cols={2} spacing={8}>
                            {options.map((option, index) => {
                                const isSelected = option.word === selectedWord;
                                const canSelect = solveStatus !== 'correct';

                                return (
                                    <motion.div
                                        key={option.word}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 3 + index * 0.4, ease: 'easeInOut' }}
                                    >
                                        <WordCard selected={isSelected && canSelect} word={option.word} image={option.image} onClick={onSelect} />
                                    </motion.div>
                                )
                            })}
                        </SimpleGrid>
                    </Box>
                </Box>
                <TaskStepControl disabled={isLoading || !selectedWord} onBack={onBack} onNext={onWordSubmit} />
            </Stack>
        </Box>
    )
}

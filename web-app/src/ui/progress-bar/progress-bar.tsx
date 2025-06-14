import { Box, CloseButton, Progress, Text } from '@mantine/core'
import { motion } from 'motion/react'

import styles from './progress-bar.module.scss'

interface ProgressBarProps {
    value: number
    currentStep: number
    totalSteps: number
    onClose: () => void
}

export const ProgressBar = ({ value = 50, currentStep = 7, totalSteps = 10, onClose }: ProgressBarProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <Box className={styles.wrapper}>
                <CloseButton size='lg' onClick={onClose} />
                <Box className={styles.progressWrapper}>
                    <Progress size="sm" value={value} color='orange' />
                </Box>
                <Box className={styles.stepsWrapper}>
                    <Text fw={600} className={styles.currentStep}>{currentStep}</Text>
                    <Text className={styles.totalSteps}>/{totalSteps}</Text>
                </Box>
            </Box>
        </motion.div>
    )
}

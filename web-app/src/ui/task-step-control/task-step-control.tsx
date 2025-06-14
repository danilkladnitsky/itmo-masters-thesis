import { Box, Button } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons-react';
import { motion } from 'motion/react'
import styles from './task-step-control.module.scss'

const DELAY = 2

interface TaskStepControlProps {
    onBack: () => void
    onNext: () => void
    disabled?: boolean
}

export const TaskStepControl = ({ onBack, onNext, disabled = false }: TaskStepControlProps) => {
    return (
        <Box className={styles.wrapper}>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: DELAY }}
            >
                <Button className={styles.backButton} leftSection={<IconChevronLeft size={20} />} variant='subtle' color='gray' size='md' onClick={onBack}>
                    Назад
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: DELAY }}
            >
                {
                    disabled ? (
                        <Button size='md' variant='filled' color='gray' disabled>
                            Проверить
                        </Button>
                    ) : (
                        <Button size='md' variant='gradient' gradient={{ from: 'yellow', to: 'green', deg: 51 }} className={styles.nextButton} onClick={onNext}>
                            Проверить
                        </Button>
                    )
                }
            </motion.div>
        </Box>
    )
}

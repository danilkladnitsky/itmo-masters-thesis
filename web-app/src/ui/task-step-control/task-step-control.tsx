import { Box, Button } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react';
import { motion } from 'motion/react'
import styles from './task-step-control.module.scss'

const DELAY = 2

export const TaskStepControl = () => {
    return (
        <Box className={styles.wrapper}>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: DELAY }}
            >
                <Button className={styles.backButton} variant='transparent' color='gray' size='md'>
                    Назад
                </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: DELAY }}
            >
                <Button rightSection={<IconChevronRight size={20} />} size='md' className={styles.nextButton}>
                    Дальше
                </Button>
            </motion.div>
        </Box>
    )
}

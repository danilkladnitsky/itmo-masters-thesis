import { Box } from '@mantine/core'
import { motion } from 'motion/react'

import styles from './sentence-with-gap.module.scss'
import { ChineseCharacter } from '../chinese-character/chinese-character'
import { APP_CONFIG } from '@/config'
import { cn } from '@/utils/cn'

interface SentenceWithGapProps {
    sentence: string[]
    solveStatus: 'correct' | 'incorrect' | 'pending'
}

export const SentenceWithGap = ({ sentence, solveStatus = 'pending' }: SentenceWithGapProps) => {
    return (
        <Box className={styles.wrapper}>
            <Box className={cn(styles.sentenceWrapper, styles[solveStatus])}>
                {sentence.map((word, index, { length }) => {
                    const maxDelay = length * 0.2

                    if (word === APP_CONFIG.GAP_CHARACTER) {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 100 }}
                                transition={{ duration: 0.7, delay: maxDelay + 0.5, ease: 'easeInOut' }}
                            >
                                <ChineseCharacter isGap character={word} />
                            </motion.div>
                        )
                    }

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.3, ease: 'easeInOut' }}
                        >
                            <ChineseCharacter character={word} />
                        </motion.div>
                    )
                })}
            </Box>
        </Box>
    )
}

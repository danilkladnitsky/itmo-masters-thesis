import { Box } from '@mantine/core'
import { motion } from 'motion/react'

import styles from './sentence-with-gap.module.scss'
import { ChineseCharacter } from '../chinese-character/chinese-character'
import { APP_CONFIG } from '@/config'

interface SentenceWithGapProps {
    sentence: string[]
}

export const SentenceWithGap = ({ sentence }: SentenceWithGapProps) => {
    return (
        <Box className={styles.wrapper}>
            <Box className={styles.sentenceWrapper}>
                {sentence.map((word, index, { length }) => {
                    const maxDelay = length * 0.3

                    if (word === APP_CONFIG.GAP_CHARACTER) {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 60 }}
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
                            transition={{ duration: 0.7, delay: index * 0.3, ease: 'easeInOut' }}
                        >
                            <ChineseCharacter character={word} />
                        </motion.div>
                    )
                })}
            </Box>
        </Box>
    )
}

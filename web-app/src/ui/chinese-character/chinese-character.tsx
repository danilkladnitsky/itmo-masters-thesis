import { Box, Indicator, Text } from '@mantine/core'

import styles from './chinese-character.module.scss'
import { cn } from '@/utils/cn'

interface ChineseCharacterProps {
    character: string
    isGap?: boolean
    pinyin?: string
    showPinyin?: boolean
}

const isDot = (character: string) => character === '。'

export const ChineseCharacter = ({ character, isGap = false, pinyin = 'wo', showPinyin = false }: ChineseCharacterProps) => {
    return (
        <Box className={styles.wrapper}>
            {
                isGap ? (
                    <Box className={styles.gapWrapper}>
                        <Indicator size={8} position='middle-center' processing className={styles.gap}>
                            <Box className={styles.gapCharacter} />
                        </Indicator>
                    </Box>
                ) : (
                    <>
                        <Text className={cn(styles.character, isDot(character) ? styles.dot : undefined)}>{character}</Text>
                        {showPinyin && <Text className={styles.pinyin}>{pinyin}</Text>}
                    </>
                )
            }
        </Box>
    )
}

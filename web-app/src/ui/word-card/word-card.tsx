import { Box, Image, Text } from '@mantine/core'
import basicCat from '@/assets/cards/basic_cat.png'

import styles from './word-card.module.scss'
import { cn } from '@/utils/cn'

interface WordCardProps {
    word: string
    onClick?: (word: string) => void
    image?: string
    selected?: boolean
}

export const WordCard = ({ word, image, selected = false, onClick }: WordCardProps) => {
    return (
        <Box className={cn(styles.wrapper, selected ? styles.selected : undefined)} onClick={() => onClick?.(word)}>
            <Image className={styles.image} src={basicCat || image} alt={word} />
            <Text className={styles.word}>{word}</Text>
        </Box>
    )
}

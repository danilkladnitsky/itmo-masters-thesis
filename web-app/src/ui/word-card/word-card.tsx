import { Badge, Box, Text } from '@mantine/core'

import styles from './word-card.module.scss'
import { cn } from '@/utils/cn'

interface WordCardProps {
    word: string
    onClick?: (word: string) => void
    image?: string
    selected?: boolean
    subtitle?: string
    badge?: string
    blur?: boolean
}

export const WordCard = ({ word, selected = false, onClick, subtitle, badge, blur = false }: WordCardProps) => {
    return (
        <Box className={cn(styles.wrapper, selected ? styles.selected : undefined)} onClick={() => onClick?.(word)}>
            {/* {selected && <IconCircleCheckFilled color='#00FF00' className={styles.star} size={24} />} */}
            <Text className={cn(styles.word)}>{word}</Text>
            {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
            {badge && <Badge className={styles.badge} variant='gradient' gradient={{ from: 'yellow', to: 'green', deg: 51 }}>{badge}</Badge>}
        </Box>
    )
}

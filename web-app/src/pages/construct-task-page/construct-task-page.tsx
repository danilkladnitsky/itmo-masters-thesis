import { PageWrapper } from "@/ui/page-wrapper/page-wrapper"
import { WordCard } from "@/ui/word-card/word-card"
import { Box, Button, SimpleGrid, Stack, Text } from "@mantine/core"

import styles from './construct-task-page.module.scss'
import { useState } from "react"
import { useNavigate } from "react-router"

const wordGroups = [
    { word: '他们', subtitle: 'Местоимения', badge: 'HSK 1' },
    { word: '时间', subtitle: 'Время', badge: 'HSK 1' },
    { word: '人', subtitle: 'Люди', badge: 'HSK 1' },
    { word: '是看说', subtitle: 'Действия', badge: 'HSK 1' },
    { word: '吗', subtitle: 'Вопросы', badge: 'HSK 1' },
    { word: '大小', subtitle: 'Прилагательные', badge: 'HSK 1' },
]

export const ConstructTaskPage = () => {
    const [selectedWords, setSelectedWords] = useState<string[]>([])
    const navigate = useNavigate()

    const handleWordClick = (word: string) => {
        setSelectedWords((prev) => {
            if (prev.includes(word)) {
                return prev.filter((w) => w !== word)
            }
            return [...prev, word]
        })
    }

    const onNext = () => {
        navigate('/build-sentence')
    }


    return (
        <PageWrapper>
            <Stack gap={16} className={styles.constructorContainer}>
                <Text className={styles.taskTitle}>Выберите наборы слов:</Text>
                <Box className={styles.wordGrid}>
                    <SimpleGrid cols={2} spacing={8}>
                        {
                            wordGroups.map((group) => (
                                <WordCard selected={selectedWords.includes(group.word)} onClick={() => handleWordClick(group.word)} key={group.word} word={group.word} subtitle={group.subtitle} badge={group.badge} />
                            ))
                        }
                    </SimpleGrid>
                </Box>
                <Button variant='filled' size='lg' color='green' fullWidth onClick={onNext}>
                    Далее
                </Button>
            </Stack>
        </PageWrapper>
    )
}

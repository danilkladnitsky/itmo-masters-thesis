import { PageWrapper } from "@/ui/page-wrapper/page-wrapper"
import { WordCard } from "@/ui/word-card/word-card"
import { Box, Button, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core"

import styles from './construct-task-page.module.scss'
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { useWordBundles } from "@/api/useWordBundles"
import { useGenerateGapTask } from "@/api/useGenerateGapTask"

export const ConstructTaskPage = () => {
    const { data: wordBundles, isLoading } = useWordBundles()
    const { mutateAsync: generateGapTask, isPending } = useGenerateGapTask()
    const [selectedBundleIds, setSelectedBundleIds] = useState<number[]>([])
    const navigate = useNavigate()

    const handleWordClick = (id: number) => {
        setSelectedBundleIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((w) => w !== id)
            }
            return [...prev, id]
        })
    }

    const onNext = async () => {
        await generateGapTask(selectedBundleIds)
        navigate('/build-sentence')
    }

    const bundles = useMemo(() => {
        if (!wordBundles) return []

        return wordBundles.map((bundle) => ({
            word: bundle.words[0],
            subtitle: bundle.bundleName,
            badge: 'HSK 1',
            id: bundle.id
        }))
    }, [wordBundles])

    if (isLoading) {
        return <PageWrapper>
            <Stack gap={16} className={styles.constructorContainer}>
                <Skeleton height={40} />
                <Box className={styles.wordGrid}>
                    <SimpleGrid cols={2} spacing={8}>
                        {
                            Array.from({ length: 12 }).map((_, index) => (
                                <Skeleton key={index} height={200} />
                            ))
                        }
                    </SimpleGrid>
                </Box>
            </Stack>
        </PageWrapper>
    }


    return (
        <PageWrapper>
            <Stack gap={16} className={styles.constructorContainer}>
                <Text className={styles.taskTitle}>Выберите наборы слов:</Text>
                <Box className={styles.wordGrid}>
                    <SimpleGrid cols={2} spacing={8}>
                        {
                            bundles.map((group) => (
                                <WordCard selected={selectedBundleIds.includes(group.id)} onClick={() => handleWordClick(group.id)} key={group.word} word={group.word} subtitle={group.subtitle} badge={group.badge} />
                            ))
                        }
                    </SimpleGrid>
                </Box>
                <Button disabled={isPending} loading={isPending} variant='filled' size='lg' color='green' fullWidth onClick={onNext}>
                    Далее
                </Button>
            </Stack>
        </PageWrapper>
    )
}

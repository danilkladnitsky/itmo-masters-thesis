/* eslint-disable react-hooks/exhaustive-deps */
import { PageWrapper } from "@/ui/page-wrapper/page-wrapper"
import { WordCard } from "@/ui/word-card/word-card"
import { Box, Button, Center, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core"

import styles from './construct-task-page.module.scss'
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { useAppContext } from "@/context/app-context"
import { ProgressBar } from "@/ui/progress-bar/progress-bar"

export const ConstructTaskPage = () => {
    const { generateWordBundles, generateGapTask, llmProvider, wordBundles, generatedTaskCount } = useAppContext()
    const [selectedBundleIds, setSelectedBundleIds] = useState<number[]>([])
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerateWordBundles = async () => {
        setIsLoading(true)
        await generateWordBundles()
        setIsLoading(false)
    }

    const handleWordClick = (id: number) => {
        setSelectedBundleIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((w) => w !== id)
            }
            return [...prev, id]
        })
    }

    const onNext = async () => {
        setIsGenerating(true)
        await generateGapTask(selectedBundleIds)
        setIsGenerating(false)
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

    useEffect(() => {
        handleGenerateWordBundles()
    }, [])


    const words = useMemo(() => {
        return wordBundles.flatMap(b => b.words)
    }, [wordBundles])


    const totalProgress = useMemo(() => {
        return generatedTaskCount / Math.min(words.length, 6) * 100
    }, [generatedTaskCount, words.length])

    if (isGenerating && llmProvider === 'local') {
        return <PageWrapper>
            <Stack gap={16} className={styles.constructorContainer}>
                <ProgressBar animated color="grape" value={totalProgress} currentStep={generatedTaskCount} totalSteps={Math.min(words.length, 6)} onClose={() => {
                    window.location.reload()
                }} />
                <Center>
                    <Text>Генерируем задания с помощью ИИ...</Text>
                </Center>
            </Stack>
        </PageWrapper>
    }

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
                <Button disabled={isLoading} loading={isLoading} variant='filled' size='lg' color='green' fullWidth onClick={onNext}>
                    Далее
                </Button>
            </Stack>
        </PageWrapper>
    )
}

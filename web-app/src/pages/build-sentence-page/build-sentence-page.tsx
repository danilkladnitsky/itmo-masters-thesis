import { APP_CONFIG } from '@/config'
import { PageWrapper } from '@/ui/page-wrapper/page-wrapper'
import { BuildSentenceWidget } from '@/widget/build-sentence-widget/build-sentence-widget'
import { Box, Button, Group, Notification, Text } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { IconCheck, IconChevronRight } from '@tabler/icons-react';
import styles from './build-sentence-page.module.scss'

import { useNavigate } from 'react-router'
import { useStore } from '@/store'

export const BuildSentencePage = () => {
    const { tasks } = useStore()

    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [solveStatus, setSolveStatus] = useState<'correct' | 'incorrect' | 'pending'>('pending');
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const navigate = useNavigate()

    const currentTask = useMemo(() => {
        return tasks[currentStep]
    }, [tasks, currentStep])


    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    const onBack = () => {
        const prevStep = currentStep - 1;
        if (prevStep < 1) {
            navigate('/')
            return
        }

        setCurrentStep(prevStep);
        setSelectedWord(null);
        setSolveStatus('pending');
    }

    const onNext = () => {
        const nextStep = currentStep + 1;

        if (nextStep >= tasks.length) {
            navigate('/')
            return
        }

        setSelectedWord(null);
        setSolveStatus('pending');
        setCurrentStep(nextStep);
    }

    const onCancel = () => {
        navigate('/')
    }

    const sentence = useMemo(() => {
        return currentTask.sentence.map((word,) => {
            if (word === APP_CONFIG.GAP_CHARACTER && selectedWord) {
                return selectedWord;
            }
            return word;
        });
    }, [selectedWord, currentTask]);

    const onSelect = (word: string) => {
        if (solveStatus !== 'correct') {
            setSelectedWord(word);
        }
    }

    const onWordSubmit = () => {
        if (selectedWord === currentTask.answer) {
            setSolveStatus('correct');
        } else {
            setSolveStatus('incorrect');
        }
    }

    return (
        <PageWrapper className={styles.pageWrapper}>
            <BuildSentenceWidget
                onClose={onCancel}
                solveStatus={solveStatus}
                isLoading={isLoading}
                sentence={sentence}
                options={currentTask.options.filter((option) => option.trim()).map((option) => ({
                    word: option,
                }))}
                currentStep={currentStep}
                totalSteps={tasks.length}
                selectedWord={selectedWord}
                onSelect={onSelect}
                onBack={onBack}
                onWordSubmit={onWordSubmit}

            />
            {solveStatus === 'correct' && <Box className={styles.notification}>
                <Notification className={styles.notificationContent} withBorder icon={<IconCheck size={20} />} color="green" withCloseButton={false} >
                    <Group justify='space-between' align='center'>
                        <Text>Правильно!</Text>
                        <Button size='md' className={styles.notificationButton} rightSection={<IconChevronRight size={20} />} variant='gradient' gradient={{ from: 'yellow', to: 'green', deg: 51 }} onClick={onNext}>Дальше</Button>
                    </Group>
                </Notification>
            </Box>}
        </PageWrapper>
    )
}

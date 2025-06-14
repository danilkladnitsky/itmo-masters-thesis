import { APP_CONFIG } from '@/config'
import { PageWrapper } from '@/ui/page-wrapper/page-wrapper'
import { BuildSentenceWidget } from '@/widget/build-sentence-widget/build-sentence-widget'
import { Box, Button, Group, Notification, Text } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { IconCheck, IconChevronRight } from '@tabler/icons-react';
import styles from './build-sentence-page.module.scss'


// 我现在要吃饭
const CORRECT_WORD = '爸爸'
const SENTENCE = ['我', APP_CONFIG.GAP_CHARACTER, '要', '吃饭', '。']
const OPTIONS = [
    {
        word: '爸爸',
        image: 'https://picsum.photos/200/300'
    },
    {
        word: '妈妈',
        image: 'https://picsum.photos/200/300'
    },
    {
        word: '哥哥',
        image: 'https://picsum.photos/200/300'
    },
    {
        word: '妹妹',
        image: 'https://picsum.photos/200/300'
    },
]

export const BuildSentencePage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [solveStatus, setSolveStatus] = useState<'correct' | 'incorrect' | 'pending'>('pending');
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    const onBack = () => {
        setCurrentStep(currentStep - 1);
    }

    const onNext = () => {
        setSelectedWord(null);
        setSolveStatus('pending');
        setCurrentStep(currentStep + 1);
    }

    const sentence = useMemo(() => {
        return SENTENCE.map((word,) => {
            if (word === APP_CONFIG.GAP_CHARACTER && selectedWord) {
                return selectedWord;
            }
            return word;
        });
    }, [selectedWord]);

    const onSelect = (word: string) => {
        if (solveStatus !== 'correct') {
            setSelectedWord(word);
        }
    }

    const onWordSubmit = () => {
        if (selectedWord === CORRECT_WORD) {
            setSolveStatus('correct');
        } else {
            setSolveStatus('incorrect');
        }
    }

    return (
        <PageWrapper className={styles.pageWrapper}>
            <BuildSentenceWidget
                solveStatus={solveStatus}
                isLoading={isLoading}
                sentence={sentence}
                options={OPTIONS}
                currentStep={currentStep}
                totalSteps={10}
                selectedWord={selectedWord}
                onSelect={onSelect}
                onBack={onBack}
                onWordSubmit={onWordSubmit}
            />
            {solveStatus === 'correct' && <Box className={styles.notification}>
                <Notification className={styles.notificationContent} withBorder icon={<IconCheck size={20} />} title="Ого..." color="green" withCloseButton={false} >
                    <Group align='center' gap={12}>
                        <Text>Вы выбрали правильное слово!</Text>
                        <Button className={styles.notificationButton} rightSection={<IconChevronRight size={20} />} size='md' variant='gradient' gradient={{ from: 'yellow', to: 'green', deg: 51 }} onClick={onNext}>Дальше</Button>
                    </Group>
                </Notification>
            </Box>}
        </PageWrapper>
    )
}

/* eslint-disable react-hooks/exhaustive-deps */
import { useGenerateGapTask } from "@/api/useGenerateGapTask";
import { useGenerateWordBundles } from "@/api/useGenerateWordBundles";
import { usePing } from "@/api/usePing";
import { createLLMEngine, type LLMEngine } from "@/llm/engine";
import type { Task, WordBundle } from "@/types";
import { LLMEngineLoader } from "@/ui/llm-engine-loader/llm-engine-loader";
import { SelectModel } from "@/ui/select-model/select-model";
import type { InitProgressReport } from "@mlc-ai/web-llm";
import { useSnackbar } from "notistack";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface AppContextType {
    llmProvider: "api" | "local";
    wordBundles: WordBundle[];
    gapTask: Task[];
    isLive: boolean;
    generatedTaskCount: number;
    generateWordBundles: () => Promise<void>;
    generateGapTask: (bundleIds: number[]) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const llmEngineRef = useRef<LLMEngine | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync: generateWordBundlesWithApi } = useGenerateWordBundles();
    const { mutateAsync: generateGapTaskWithApi } = useGenerateGapTask();
    const { data: isLive } = usePing();

    const [llmProvider, setLlmProvider] = useState<"api" | "local" | undefined>(undefined);
    const [progressReport, setProgressReport] = useState<InitProgressReport>({ progress: 0, text: '', timeElapsed: 0 });
    const [wordBundles, setWordBundles] = useState<WordBundle[]>([]);
    const [gapTask, setGapTask] = useState<Task[]>([]);

    const [generatedTaskCount, setGeneratedTaskCount] = useState(0)

    const generateGapTaskWithLocal = useCallback(async (selectedWordBundles: WordBundle[]): Promise<Task[]> => {
        const llmEngine = llmEngineRef.current;
        if (!llmEngine) return [];

        const result = await llmEngine.generateGapTask(selectedWordBundles, () => {
            setGeneratedTaskCount(prev => prev + 1)
        });

        return result;
    }, [wordBundles]);

    const generateWordBundles = useCallback(async () => {
        const result = await generateWordBundlesWithApi();
        setWordBundles(result);
    }, [llmProvider]);

    const generateGapTask = useCallback(async (ids: number[]) => {
        const selectedBundles = wordBundles.filter(bundle => ids.includes(bundle.id));

        const result = llmProvider === "api" ?
            await generateGapTaskWithApi(ids)
            : await generateGapTaskWithLocal(selectedBundles);

        setGapTask(result);
    }, [llmProvider, wordBundles]);

    const onInitProgress = useCallback(({ progress, text, timeElapsed }: InitProgressReport) => {
        setProgressReport({ progress, text, timeElapsed });

        if (progress === 1) {
            setLlmProvider("local");
            enqueueSnackbar("LLM модель загружена!", { variant: "success", preventDuplicate: true, autoHideDuration: 2000 });
        }
    }, [])

    const initLLMEngine = useCallback(async () => {
        const llmEngine = await createLLMEngine({
            model: "Qwen3-0.6B-q4f16_1-MLC",
            initProgressCallback: onInitProgress,
        });

        llmEngineRef.current = llmEngine
    }, []);

    const value = useMemo(() => ({
        llmProvider: llmProvider ?? "api",
        generateWordBundles, generateGapTask, gapTask, wordBundles, isLive, generatedTaskCount
    }), [llmProvider, generateWordBundles, generateGapTask, gapTask, wordBundles, isLive, generatedTaskCount]);

    useEffect(() => {
        if (isLive) {
            enqueueSnackbar("Бэкенд доступен")
        }
    }, [isLive])

    if (!llmProvider) {
        return <SelectModel
            value={llmProvider}
            onSubmit={(value = 'api') => {
                setLlmProvider(value)

                if (value === "local") {
                    initLLMEngine();
                }
            }}
        />
    }

    if (llmProvider === "local" && progressReport.progress !== 1) {
        return <LLMEngineLoader progressReport={progressReport} />
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
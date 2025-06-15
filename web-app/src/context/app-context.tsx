/* eslint-disable react-hooks/exhaustive-deps */
import { useGenerateGapTask } from "@/api/useGenerateGapTask";
import { useGenerateWordBundles } from "@/api/useGenerateWordBundles";
import { createLLMEngine, type LLMEngine } from "@/llm/engine";
import type { Task, WordBundle } from "@/types";
import { LLMEngineLoader } from "@/ui/llm-engine-loader/llm-engine-loader";
import { SelectModel } from "@/ui/select-model/select-model";
import type { InitProgressReport } from "@mlc-ai/web-llm";
import { useSnackbar } from "notistack";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface AppContextType {
    llmProvider: "api" | "local";
    wordBundles: WordBundle[];
    gapTask: Task[];
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

    const [llmProvider, setLlmProvider] = useState<"api" | "local" | null>(null);
    const [progressReport, setProgressReport] = useState<InitProgressReport>({ progress: 0, text: '', timeElapsed: 0 });
    const [wordBundles, setWordBundles] = useState<WordBundle[]>([]);
    const [gapTask, setGapTask] = useState<Task[]>([]);

    const generateWordBundlesWithLocal = useCallback(async (): Promise<WordBundle[]> => {
        const llmEngine = llmEngineRef.current;
        if (!llmEngine) return [];

        const result = await llmEngine.generateWordBundles("Generate a sentence about a cat");
        return result;
    }, []);

    const generateGapTaskWithLocal = useCallback(async (): Promise<Task[]> => {
        const llmEngine = llmEngineRef.current;
        if (!llmEngine) return [];
        const result = await llmEngine.generateGapTask(wordBundles);

        return result;
    }, [wordBundles]);

    const generateWordBundles = useCallback(async () => {
        const result = llmProvider === "api" ? await generateWordBundlesWithApi() : await generateWordBundlesWithLocal();
        setWordBundles(result);
    }, [llmProvider]);

    const generateGapTask = useCallback(async () => {
        const result = llmProvider === "api" ?
            await generateGapTaskWithApi(wordBundles.map(bundle => bundle.id))
            : await generateGapTaskWithLocal();

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
            model: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
            initProgressCallback: onInitProgress,
        });

        llmEngineRef.current = llmEngine
    }, []);

    const value = useMemo(() => ({ llmProvider: llmProvider ?? "api", generateWordBundles, generateGapTask, gapTask, wordBundles }), [llmProvider, generateWordBundles, generateGapTask, gapTask, wordBundles]);

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
/* eslint-disable react-hooks/exhaustive-deps */
import { useGenerateWordBundles } from "@/api/useGenerateWordBundles";
import { createLLMEngine, type LLMEngine } from "@/llm/engine";
import type { WordBundle } from "@/types";
import { LLMEngineLoader } from "@/ui/llm-engine-loader/llm-engine-loader";
import type { InitProgressReport } from "@mlc-ai/web-llm";
import { useSnackbar } from "notistack";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface AppContextType {
    llmProvider: "api" | "local";
    wordBundles: WordBundle[];
    generateSentence: () => Promise<void>;
    generateWordBundles: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync: generateWordBundlesWithApi } = useGenerateWordBundles();

    const [llmProvider, setLlmProvider] = useState<"api" | "local">("api");
    const llmEngineRef = useRef<LLMEngine | null>(null);
    const [progressReport, setProgressReport] = useState<InitProgressReport>({ progress: 0, text: '', timeElapsed: 0 });
    const [wordBundles, setWordBundles] = useState<WordBundle[]>([]);

    const generateWordBundlesWithLocal = useCallback(async (): Promise<WordBundle[]> => {
        const llmEngine = llmEngineRef.current;
        if (!llmEngine) return [];

        const result = await llmEngine.generateWordBundles("Generate a sentence about a cat");
        return result;
    }, []);

    const generateWordBundles = useCallback(async () => {
        if (llmProvider === "api") {
            const result = await generateWordBundlesWithApi();
            setWordBundles(result);
        } else {
            const result = await generateWordBundlesWithLocal();
            setWordBundles(result);
        }
    }, [llmProvider]);

    const onInitProgress = useCallback(({ progress, text, timeElapsed }: InitProgressReport) => {
        setProgressReport({ progress, text, timeElapsed });

        if (progress === 1) {
            setLlmProvider("local");
            enqueueSnackbar("LLM модель загружена!", { variant: "success", preventDuplicate: true, autoHideDuration: 2000 });
        }
    }, [])

    const generateSentence = useCallback(async () => {
        const llmEngine = llmEngineRef.current;
        if (!llmEngine) return;
        const result = await llmEngine.generateText("Generate a sentence about a cat");
        console.log(result);
    }, []);

    const initLLMEngine = useCallback(async () => {
        const llmEngine = await createLLMEngine({
            model: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
            initProgressCallback: onInitProgress,
        });

        llmEngineRef.current = llmEngine
    }, []);

    useEffect(() => {
        initLLMEngine();
    }, []);

    const value = useMemo(() => ({ generateSentence, llmProvider, generateWordBundles, wordBundles }), [generateSentence, llmProvider, generateWordBundles, wordBundles]);

    if (progressReport.progress !== 1) {
        return <LLMEngineLoader progressReport={progressReport} />
    }


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
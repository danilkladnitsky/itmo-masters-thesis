import { createLLMEngine, type LLMEngine } from "@/llm/engine";
import { LLMEngineLoader } from "@/ui/llm-engine-loader/llm-engine-loader";
import type { InitProgressReport } from "@mlc-ai/web-llm";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface AppContextType {
    generateSentence: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const llmEngineRef = useRef<LLMEngine | null>(null);
    const [progressReport, setProgressReport] = useState<InitProgressReport>({ progress: 0, text: '', timeElapsed: 0 });

    const onInitProgress = useCallback(({ progress, text, timeElapsed }: InitProgressReport) => {
        setProgressReport({ progress, text, timeElapsed });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        initLLMEngine();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(() => ({ generateSentence }), [generateSentence]);

    if (progressReport.progress !== 1) {
        return <LLMEngineLoader progressReport={progressReport} />
    }


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
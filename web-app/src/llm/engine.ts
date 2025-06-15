import { CreateWebWorkerMLCEngine, type ChatCompletionMessageParam, type InitProgressCallback, type WebWorkerMLCEngine } from "@mlc-ai/web-llm";

import { LLM_CONFIG } from "./config";

interface CreateLLMEngine {
    model: string;
    initProgressCallback: InitProgressCallback;
}

export interface LLMEngine {
    engine: WebWorkerMLCEngine;
    generateText(prompt: string): Promise<string>;
}

export async function createLLMEngine({ model, initProgressCallback }: CreateLLMEngine): Promise<LLMEngine> {
  const engine = await CreateWebWorkerMLCEngine(
    new Worker(
      new URL("./worker.ts", import.meta.url), 
      {
        type: "module",
      }
    ),
    model,
    { initProgressCallback }, // engineConfig
  );

  
    return {
        engine,
        generateText: async (prompt: string) => {
            const messages: ChatCompletionMessageParam[] = [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]

            console.info('messages', messages);

            const response = await engine.chatCompletion({
                ...LLM_CONFIG,
                model,
                messages,
            });

            console.info('response', response);

            const text = response.choices[0].message.content;

            if (!text) {
                throw new Error("No text returned from LLM");
            }

            return text;
        }
    }
}
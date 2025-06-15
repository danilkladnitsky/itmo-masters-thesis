import { CreateWebWorkerMLCEngine, type ChatCompletionMessageParam, type InitProgressCallback, type WebWorkerMLCEngine } from "@mlc-ai/web-llm";

import { LLM_CONFIG } from "./config";
import type { WordBundle } from "@/types";

interface CreateLLMEngine {
    model: string;
    initProgressCallback: InitProgressCallback;
}

export interface LLMEngine {
    engine: WebWorkerMLCEngine;
  generateText(prompt: string): Promise<string>;
  generateWordBundles(prompt: string): Promise<WordBundle[]>;
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

  const generateText = async (prompt: string) => {
    const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
    ]

    console.info('messages', messages);

    const response = await engine.chatCompletion({
        ...LLM_CONFIG,
        model,
      messages,
        response_format: { type: "json_object" },
    });

    console.info('response', response);

    const text = response.choices[0].message.content;

    if (!text) {
        throw new Error("No text returned from LLM");
    }

    return text;
  }

  const generateWordBundles = async () => {
    const prompt = `
    You need to generate a list of HSK 1 words based on subject.
    Response should be in JSON format.
    Example: 
    [{
        "bundleName": "Время",
        "words": ["今天", "昨天", "明天"]
    },
    {
        "bundleName": "Животные",
        "words": ["猫", "狗", "鸟"]
    }
    ]
    `

    const response = await generateText(prompt)

    const wordBundles = JSON.parse(response) as WordBundle[]

    return wordBundles
    
    
  }

  
    return {
        engine,
      generateText,
      generateWordBundles,
    }
}
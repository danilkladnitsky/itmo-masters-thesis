import { CreateWebWorkerMLCEngine, type ChatCompletionMessageParam, type InitProgressCallback, type WebWorkerMLCEngine } from "@mlc-ai/web-llm";

import { LLM_CONFIG } from "./config";
import type { Task, WordBundle } from "@/types";
import { generateWordBundlesPrompt } from "./prompts";
import { APP_CONFIG } from "@/config";

interface CreateLLMEngine {
    model: string;
    initProgressCallback: InitProgressCallback;
}

export interface LLMEngine {
    engine: WebWorkerMLCEngine;
  generateText(prompt: string): Promise<string>;
  generateWordBundles(): Promise<WordBundle[]>;
  generateGapTask(wordBundles: WordBundle[], onTaskGeneration: () => void): Promise<Task[]>;
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

  const generateText = async (prompt: string, fn?: (response: string) => void) => {
    try {
      const messages: ChatCompletionMessageParam[] = [
        { role: 'assistant', content: `你是一个汉语老师，擅长用简单的词语教学。接下来你需要根据给定的词语造句。
要求如下：
	1.	句子中必须包含指定词语。
	2.	只能使用HSK 1级词汇（包括标点符号）。
	3.	只写一句完整的话，不要添加解释或其他内容。
	4.	返回内容必须是干净的句子，没有额外说明或格式符号。`},
        { role: "user", content: `/no_think ${prompt}` }
    ]

    console.info('received prompt', prompt);

    const response = await engine.chatCompletion({
        ...LLM_CONFIG,
        model,
      messages,
    });
      


      const text = response.choices[0].message.content;
      if (!text) {
        return '';
      }
      console.info('response', 'prompt:', text);
      fn?.(text)

      return text;
    } catch (error) {
      console.log(error)
      return ''
      
    }
  }

  const generateWordBundles = async () => {
    const response = await generateText(generateWordBundlesPrompt())
    const wordBundles = JSON.parse(response) as WordBundle[]

    return wordBundles
  }

  const generateGapTask = async (wordBundles: WordBundle[], onTaskGeneration: () => void) => {
    const promptFn = (v: string) => ({
      prompt: `请用词语"${v}"造一个句子，只使用 HSK 1 级词汇，并且只写一句话。`,
      word: v
    })

    const words = wordBundles.flatMap(w => w.words)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)

    const promptList = words.map(promptFn)
    
    const handleTaskGeneration = () => {
      onTaskGeneration()
    }

    const promptsPromisesList = promptList.map(o => generateText(o.prompt, handleTaskGeneration).then(sentence => ({
      sentence,
      word: o.word
    })))

    const resultList = await Promise.allSettled(promptsPromisesList)

    const removeThink = (response: string): string => {
      const match = response.match(/<\/think>\s*(.+)/s)
      if (match && match[1]) {
        return match[1].trim()
      }
      return response.trim() // fallback in case no <think> tag
    }

    const response: Task[] = []

    console.log(resultList)

    resultList.forEach(result => {
      if (result.status === 'fulfilled') {
        const { sentence: rawSentence, word } = result.value

        const sentence = removeThink(rawSentence).replace(word, APP_CONFIG.GAP_CHARACTER).split('')

        const existingWords = response.map(t => t.options).flat()
        const options = wordBundles.flatMap(w => w.words)
        .filter(w => w !== word && !existingWords.includes(w))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        const task: Task = {
          id: 0,
          options: [...options, word],
          sentence,
          answer: word
        }

        response.push(task)
      }
    })

    console.log(response)
    return response
  }

  
    return {
        engine,
      generateText,
      generateWordBundles,
      generateGapTask,
    }
}
import type { IAgent } from "../types";
import type { CreateOpenAIAgent } from "./types";

import OpenAI from "openai"

export const createOpenAIAgent = ({ apiKey, url, temperature }: CreateOpenAIAgent): IAgent => {
    const openai = new OpenAI({ apiKey, baseURL: url })

        return {
            generateText: async (input) => {
                try {
                    const messages = input.map(i => ({
                        role: (i.role as "user" | "assistant" | "system"),
                        content: i.content,
                    }))

                    const response = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        temperature,
                        messages
                    })
                    
                    return {
                        content: response.choices[0].message.content || "",
                        ok: true,
                    }
                } catch (error) {
                    console.error(error)
                    return {
                        ok: false,
                        error: error as string,
                    }
                }
            }
    }
}
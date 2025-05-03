import { Ollama } from "ollama";

import type { IAgent } from "../types";
import type { CreateOllamaAgent } from "./types";

export const createOllamaAgent = ({ model, url }: CreateOllamaAgent): IAgent => {
    const ollama = new Ollama({ host: url });

    return {
        generateText: async (input, options) => {
            try {
                const response = await ollama.generate({
                    model,
                    prompt: input.map(i => i.content).join("\n"),
                    options: {  ...options, temperature: options?.temperature || 0.5, num_ctx: options?.maxTokens ?? undefined },
                });

                return {
                    content: response.response,
                    ok: true,
                };
            } catch (error) {
                console.error(error);

                return {
                    ok: false,
                    error: error as string,
                }
            }
            }
    }
}
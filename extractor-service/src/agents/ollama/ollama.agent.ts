import { Ollama } from "ollama";

import type { IAgent } from "../types";
import type { CreateOllamaAgent } from "./types";

export const createOllamaAgent = ({ model, url, temperature = 0.5 }: CreateOllamaAgent): IAgent => {
    const ollama = new Ollama({ host: url });

    return {
        generateText: async (input) => {
            try {
                const response = await ollama.chat({
                    model,
                    messages: input,
                    stream: false,
                    options: { temperature },
                });

                return {
                    content: response.message.content,
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
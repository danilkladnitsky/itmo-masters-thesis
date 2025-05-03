import ollama from "ollama";

import type { CreateLLMModule, LLMModule } from "./types";

export const createLLMModule = ({ model }: CreateLLMModule): LLMModule => {
  return {
    run: async (messages) => {
      try {
        const response = await ollama.chat({
            model,
            messages,
        });
          
          return { output: response.message.content, ok: true, error: null };
      } catch (error: unknown) {
        return { output: null, ok: false, error: (error as Error).message };
      }
    },
  };
};

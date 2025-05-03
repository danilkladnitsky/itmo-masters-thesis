import type { LLMInput, LLMResponse } from "@/domain/llm/types";

export interface LLMModule {
  run(input: LLMInput[]): Promise<LLMResponse>;
}

export interface CreateLLMModule {
    model: string;
}

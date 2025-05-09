import type { LLMInput, LLMOptions, LLMOutput } from "@/common/types";

export interface IAgent {
    generateText: (input: LLMInput[], options?: Partial<LLMOptions>) => Promise<LLMOutput>;
}

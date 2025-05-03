import type { LLMInput, LLMOutput } from "@/common/types";

export interface IAgent {
    generateText: (input: LLMInput[]) => Promise<LLMOutput>;
}

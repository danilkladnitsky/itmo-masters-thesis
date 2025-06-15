import type { ChatCompletionRequestBase } from "@mlc-ai/web-llm"

export type LLMConfig = Pick<ChatCompletionRequestBase, 'temperature'>

export const LLM_CONFIG: LLMConfig = {
    temperature: 0.7
}
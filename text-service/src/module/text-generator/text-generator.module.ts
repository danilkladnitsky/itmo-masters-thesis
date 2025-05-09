import type { CreateTextGeneratorModule, ITextGeneratorModule, TextGenerateInput } from "./types";

const PROMPT_TEMPLATE = ({ hsk, subject }: TextGenerateInput) => `
    You are a text generator.
    You are given a hsk level ${hsk}.
    You need to generate chinese sentences that are at the hsk level.
    The text should be about ${subject || "anything"}.
    The output should contain only sentences, no other text.
`

export const createTextGeneratorModule = ({ agent }: CreateTextGeneratorModule): ITextGeneratorModule => {
    return {
        generateText: async (input) => {
            return agent.generateText([{
                role: "system",
                content: PROMPT_TEMPLATE(input),
            }], input.options);
        }
    }
}
import type { TextGenerateInput } from "@/module/text-generator/types";
import type { CreateGeneratorController, IGeneratorController } from "./types";

export const createGeneratorController = ({ textGeneratorModule, s3Module }: CreateGeneratorController): IGeneratorController => {
    return {
        generateText: async (request) => {
            const payload = await request.json();
            const { iterations = 1 } = payload as TextGenerateInput;

            const results = [];

            for (let i = 0; i < iterations; i++) {
                const result = await textGeneratorModule.generateText(payload);
                
                if (result.ok) {
                    results.push(result.content);
                }
            }

            const combinedContent = results.join('\n\n');
            const fileName = `${Date.now()}.txt`;
            const fileUrl = await s3Module.uploadTextFile(fileName, combinedContent);
            
            const response = {
                content: combinedContent,
                fileUrl
            };

            return new Response(JSON.stringify(response));
        }
    }
}
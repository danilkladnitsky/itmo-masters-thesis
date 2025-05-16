import type { CreateGeneratorController, IGeneratorController } from "./types";

export const createGeneratorController = ({ textGeneratorModule, s3Module }: CreateGeneratorController): IGeneratorController => {
    return {
        generateText: async (request) => {
            const payload = await request.json();

            const result = await textGeneratorModule.generateText(payload);

            if(result.ok) {
                const fileName = `${Date.now()}.txt`
                const fileUrl = await s3Module.uploadTextFile(fileName, result.content)
                
                const response = {
                    content: result.content,
                    fileUrl
                }

                return new Response(JSON.stringify(response));
            }

            return new Response(result.error, { status: 500 });
        }
    }
}
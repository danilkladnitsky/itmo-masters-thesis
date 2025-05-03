import type { CreateExtractController, IExtractController } from "./types";

export const createExtractController = ({ textGeneratorModule }: CreateExtractController): IExtractController => {
    return {
        generateText: async (request) => {
            const payload = await request.json();

            const result = await textGeneratorModule.generateText(payload);

            if(result.ok) {
                return new Response(result.content);
            }

            return new Response(result.error, { status: 500 });
        }
    }
}
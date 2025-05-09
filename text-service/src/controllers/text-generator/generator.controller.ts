import type { CreateGeneratorController, IGeneratorController } from "./types";

export const createGeneratorController = ({ textGeneratorModule }: CreateGeneratorController): IGeneratorController => {
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
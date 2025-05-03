import { createOllamaAgent } from "@/agents/ollama/ollama.agent";
import { createExtractController } from "@/controllers/extractor.controller";
import { createTextGeneratorModule } from "@/module/text-generator/text-generator.module";
import { createHttpTransport } from "@/transport/http/http.transport";


const startApp = async () => {
    const textGeneratorModule = createTextGeneratorModule({
        agent: createOllamaAgent({ model: "llama2-chinese:latest" }),
    });

    const extractController = createExtractController({
        textGeneratorModule,
    });

    const httpTransport = createHttpTransport({
        port: 3000,
        extractController
    });

    await httpTransport.start();

    // graceful shutdown
    process.on("SIGINT", async () => {
        await httpTransport.stop();
        process.exit(0);
    });
}

startApp();
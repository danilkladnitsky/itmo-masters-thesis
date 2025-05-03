import { createGeneratorController } from "@/controllers/text-generator/generator.controller";
import { createOllamaAgent } from "@/agents/ollama/ollama.agent";
import { createTextGeneratorModule } from "@/module/text-generator/text-generator.module";
import { createHttpTransport } from "@/transport/http/http.transport";
import { createImageScannerModule } from "@/module/image-scanner/image-scanner.module";
import { createImageScannerController } from "@/controllers/image-scanner/image-scanner.controller";


const startApp = async () => {
    const textGeneratorModule = createTextGeneratorModule({
        agent: createOllamaAgent({ model: "llama2-chinese:latest" }),
    });

    const imageScannerModule = createImageScannerModule();


    const generatorController = createGeneratorController({
        textGeneratorModule,
    });

    const imageScannerController = createImageScannerController({
        imageScannerModule,
    });

    const httpTransport = createHttpTransport({
        port: 3000,
        generatorController,
        imageScannerController,
    });

    await httpTransport.start();

    // graceful shutdown
    process.on("SIGINT", async () => {
        await httpTransport.stop();
        process.exit(0);
    });
}

startApp();
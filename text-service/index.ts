import { createGeneratorController } from "@/controllers/text-generator/generator.controller";
import { createOllamaAgent } from "@/agents/ollama/ollama.agent";
import { createTextGeneratorModule } from "@/module/text-generator/text-generator.module";
import { createHttpTransport } from "@/transport/http/http.transport";
import { createImageScannerModule } from "@/module/image-scanner/image-scanner.module";
import { createImageScannerController } from "@/controllers/image-scanner/image-scanner.controller";
import { createYoutubeCaptionsModule } from "@/module/youtube-captions/youtube-captions.module";
import { createYoutubeCaptionsController } from "@/controllers/youtube-captions/youtube-captions.controller";


const startApp = async () => {
    const textGeneratorModule = createTextGeneratorModule({
        agent: createOllamaAgent({ model: "llama2-chinese:latest" }),
    });

    const imageScannerModule = createImageScannerModule();

    const youtubeCaptionsModule = createYoutubeCaptionsModule();

    const youtubeCaptionsController = createYoutubeCaptionsController({
        youtubeCaptionsModule
    });

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
        youtubeCaptionsController
    });

    await httpTransport.start();

    // graceful shutdown
    process.on("SIGINT", async () => {
        await httpTransport.stop();
        process.exit(0);
    });
}

startApp();
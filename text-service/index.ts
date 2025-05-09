import { createGeneratorController } from "@/controllers/text-generator/generator.controller";
import { createOllamaAgent } from "@/agents/ollama/ollama.agent";
import { createTextGeneratorModule } from "@/module/text-generator/text-generator.module";
import { createHttpTransport } from "@/transport/http/http.transport";
import { createImageScannerModule } from "@/module/image-scanner/image-scanner.module";
import { createImageScannerController } from "@/controllers/image-scanner/image-scanner.controller";
import { createYoutubeCaptionsModule } from "@/module/youtube-captions/youtube-captions.module";
import { createYoutubeCaptionsController } from "@/controllers/youtube-captions/youtube-captions.controller";
import { createS3Module } from "@/module/s3/s3.modules";

const S3_CONFIG = {
    region: process.env.S3_REGION || "",
    bucketName: process.env.S3_BUCKET || "",
    url: process.env.S3_URL || "",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
}

const startApp = async () => {
    const textGeneratorModule = createTextGeneratorModule({
        agent: createOllamaAgent({ model: "llama2-chinese:latest" }),
    });
    const imageScannerModule = createImageScannerModule();
    const youtubeCaptionsModule = createYoutubeCaptionsModule();

    const s3Module = createS3Module({
        ...S3_CONFIG
    });

    const youtubeCaptionsController = createYoutubeCaptionsController({
        youtubeCaptionsModule,
        s3Module
    });
    const generatorController = createGeneratorController({
        textGeneratorModule,
        s3Module
    });
    const imageScannerController = createImageScannerController({
        imageScannerModule,
        s3Module
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
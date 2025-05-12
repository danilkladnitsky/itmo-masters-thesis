
import { serve } from "bun";
import type { CreateHttpTransport } from "./types";

export const createHttpTransport = ({ port, generatorController, imageScannerController, youtubeCaptionsController, datasetController }: CreateHttpTransport) => {
    const app = serve({
        port,
        routes: {
            "/ping": {
                GET: () => new Response("pong", { status: 200 })
            },
            "/generate-text": {
                POST: generatorController.generateText
            },
            "/scan-image": {
                POST: imageScannerController.scanImage
            },
            "/extract-captions": {
                POST: youtubeCaptionsController.extractCaptions
            },
            "/scan-pdf": {
                POST: imageScannerController.scanPdf
            },
            "/create-dataset": {
                POST: datasetController.createDataset
            }
        }
    });

    return {
        start: async () => {
            console.log(`Server is running on port ${port}`);
        },
        stop: async () => {
            await app.stop();
        }
    }
}
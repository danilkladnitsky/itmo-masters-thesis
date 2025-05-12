
import { serve } from "bun";
import type { CreateHttpTransport } from "./types";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

export const createHttpTransport = ({ port, generatorController, imageScannerController, youtubeCaptionsController, datasetController }: CreateHttpTransport) => {
    const app = serve({
        port,
        routes: {
            "/ping": {
                GET: () => new Response("pong", { status: 200, headers: corsHeaders })
            },
            "/generate-text": {
                POST: generatorController.generateText,
                OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders })
            },
            "/scan-image": {
                POST: imageScannerController.scanImage,
                OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders })
            },
            "/extract-captions": {
                POST: youtubeCaptionsController.extractCaptions,
                OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders })
            },
            "/scan-pdf": {
                POST: imageScannerController.scanPdf,
                OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders })
            },
            "/create-dataset": {
                POST: datasetController.createDataset,
                OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders })
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
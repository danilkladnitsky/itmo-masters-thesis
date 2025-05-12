
import { serve } from "bun";
import type { CreateHttpTransport } from "./types";

export const createHttpTransport = ({ port, generatorController, imageScannerController, youtubeCaptionsController, datasetController }: CreateHttpTransport) => {
    const app = serve({
        port,
        async fetch(req) {
            const url = new URL(req.url);
            const path = url.pathname;

            if (path === "/generate-text") {
                return generatorController.generateText(req);
            }

            if (path === "/scan-image") {
                return imageScannerController.scanImage(req);
            }

            if (path === "/scan-pdf") {
                return imageScannerController.scanPdf(req);
            }

            if (path === "/extract-captions") {
                return youtubeCaptionsController.extractCaptions(req);
            }

            if (path === "/create-dataset") {
                return datasetController.createDataset(req);
            }

            return new Response("Not Found", { status: 404 });
        },
        routes: {
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
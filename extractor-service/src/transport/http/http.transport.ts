
import { serve } from "bun";
import type { CreateHttpTransport } from "./types";

export const createHttpTransport = ({ port, generatorController, imageScannerController }: CreateHttpTransport) => {
    const app = serve({
        port,
        fetch(req) {
            const url = new URL(req.url);
            const path = url.pathname;

            if (path === "/generate-text") {
                return generatorController.generateText(req);
            }

            if (path === "/scan-image") {
                return imageScannerController.scanImage(req);
            }

            return new Response("Not Found", { status: 404 });
        },
        routes: {
            "/generate-text": {
                POST: generatorController.generateText
            },
            "/scan-image": {
                POST: imageScannerController.scanImage
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
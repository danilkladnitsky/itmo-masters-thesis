
import { serve } from "bun";
import type { CreateHttpTransport } from "./types";

export const createHttpTransport = ({ port, extractController }: CreateHttpTransport) => {
    const app = serve({
        port,
        fetch(req) {
            const url = new URL(req.url);
            const path = url.pathname;

            if (path === "/generate-text") {
                return extractController.generateText(req);
            }

            return new Response("Not Found", { status: 404 });
        },
        routes: {
            "/generate-text": {
                POST: async (req) => {
                    const result = await extractController.generateText(req);
                    return result;
                }
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
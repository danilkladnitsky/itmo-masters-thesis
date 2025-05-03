import { serve } from "bun";

import type { CreateHttpModule, HttpModule } from "./types";

export const createHttpModule = ({ port }: CreateHttpModule): HttpModule => {
    const server = serve({
        port,
        fetch(req) {
            return new Response("Not Found", { status: 404 });
        },
        routes: {
            "/": async () => {
                return new Response("Hello, world!");
            },
        },
    });

    return {
        stop: server.stop
    };
}
import type { IExtractController } from "@/controllers/types";

export type CreateHttpTransport = {
    port: number;
    extractController: IExtractController;
}

export interface IHttpTransport {
    stop: () => Promise<void>;
}
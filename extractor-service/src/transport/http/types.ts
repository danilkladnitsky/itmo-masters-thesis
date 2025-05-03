import type { IImageScannerController } from "@/controllers/image-scanner/types";
import type { IGeneratorController } from "@/controllers/text-generator/types";

export type CreateHttpTransport = {
    port: number;
    generatorController: IGeneratorController;
    imageScannerController: IImageScannerController;
}

export interface IHttpTransport {
    stop: () => Promise<void>;
}
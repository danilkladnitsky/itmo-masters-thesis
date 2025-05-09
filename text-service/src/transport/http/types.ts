import type { IImageScannerController } from "@/controllers/image-scanner/types";
import type { IGeneratorController } from "@/controllers/text-generator/types";
import type { IYoutubeCaptionsController } from "@/controllers/youtube-captions/types";

export type CreateHttpTransport = {
    port: number;
    generatorController: IGeneratorController;
    imageScannerController: IImageScannerController;
    youtubeCaptionsController: IYoutubeCaptionsController;
}

export interface IHttpTransport {
    stop: () => Promise<void>;
}
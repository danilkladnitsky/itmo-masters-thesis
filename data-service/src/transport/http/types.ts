import type { IDatasetController } from "@/controllers/dataset/types";
import type { IImageScannerController } from "@/controllers/image-scanner/types";
import type { IGeneratorController } from "@/controllers/text-generator/types";
import type { IYoutubeCaptionsController } from "@/controllers/youtube-captions/types";

export type CreateHttpTransport = {
    port: number;
    datasetController: IDatasetController;
    generatorController: IGeneratorController;
    imageScannerController: IImageScannerController;
    youtubeCaptionsController: IYoutubeCaptionsController;
}

export interface IHttpTransport {
    stop: () => Promise<void>;
}
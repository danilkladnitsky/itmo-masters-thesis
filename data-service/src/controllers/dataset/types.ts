import type { IImageScannerModule } from "@/module/image-scanner/types";
import type { IS3Module } from "@/module/s3/types";
import type { ITextGeneratorModule } from "@/module/text-generator/types";
import type { IYoutubeCaptionsModule } from "@/module/youtube-captions/types";

export interface IDatasetController {
    createDataset(request: Request): Promise<Response>;
}

export type CreateDatasetController = {
    imageScannerModule: IImageScannerModule;
    textGeneratorModule: ITextGeneratorModule;
    s3Module: IS3Module;
    youtubeCaptionsModule: IYoutubeCaptionsModule;
}

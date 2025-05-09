
import type { IImageScannerModule } from "@/module/image-scanner/types";
import type { IS3Module } from "@/module/s3/types";

export type CreateImageScannerController = {
    imageScannerModule: IImageScannerModule;
    s3Module: IS3Module;
}

export interface IImageScannerController {
    scanImage: (request: Request) => Promise<Response>;
    scanPdf: (request: Request) => Promise<Response>;
}
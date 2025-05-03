
import type { IImageScannerModule } from "@/module/image-scanner/types";

export type CreateImageScannerController = {
    imageScannerModule: IImageScannerModule;
}

export interface IImageScannerController {
    scanImage: (request: Request) => Promise<Response>;
}
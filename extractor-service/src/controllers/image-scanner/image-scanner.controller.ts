import type { CreateImageScannerController, IImageScannerController } from "./types"

export const createImageScannerController = ({ imageScannerModule }: CreateImageScannerController): IImageScannerController => {
    return {
        scanImage: async (req: Request) => {
            const image = await req.arrayBuffer();
            const text = await imageScannerModule.scanImage(image);
            return new Response(text);
        }
    }
}
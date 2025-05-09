import type { CreateImageScannerController, IImageScannerController } from "./types"

export const createImageScannerController = ({ imageScannerModule }: CreateImageScannerController): IImageScannerController => {
    return {
        scanImage: async (req: Request) => {
            const image = await req.arrayBuffer();
            const text = await imageScannerModule.scanImage(image);
            return new Response(text);
        },
        scanPdf: async (req: Request) => {
            const pdf = await req.arrayBuffer();
            const text = await imageScannerModule.scanPdf(pdf);
            return new Response(text);
        }
    }
}
import type { CreateImageScannerController, IImageScannerController } from "./types"

export const createImageScannerController = ({ imageScannerModule, s3Module }: CreateImageScannerController): IImageScannerController => {
    return {
        scanImage: async (req: Request) => {
            const image = await req.arrayBuffer();
            const text = await imageScannerModule.scanImage(image);
            const fileName = `${Date.now()}.txt`
            const fileUrl = await s3Module.uploadTextFile(fileName, text)
            return new Response(fileUrl);
        },
        scanPdf: async (req: Request) => {
            const pdf = await req.arrayBuffer();
            const text = await imageScannerModule.scanPdf(pdf);
            const fileName = `${Date.now()}.txt`
            const fileUrl = await s3Module.uploadTextFile(fileName, text)
            return new Response(fileUrl);
        }
    }
}
import Tesseract from "tesseract.js";
// import { pdf } from "pdf-to-img";

import type { IImageScannerModule } from "./types";

export const createImageScannerModule = (): IImageScannerModule => {
    const scanSingleImage = async (imageBuffer: ArrayBuffer | ArrayBufferLike) => {
        const buffer = imageBuffer instanceof ArrayBuffer ? imageBuffer : new Uint8Array(imageBuffer).buffer;
        const result = await Tesseract.recognize(Buffer.from(buffer), "chi_sim");
        return result.data.text;
    }
    return {
        scanImage: scanSingleImage,
        scanPdf: async (pdfBuffer) => "not implemented",
    }
}
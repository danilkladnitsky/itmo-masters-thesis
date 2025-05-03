import Tesseract from "tesseract.js";
import { pdf } from "pdf-to-img";

import type { IImageScannerModule } from "./types";

export const createImageScannerModule = (): IImageScannerModule => {
    const scanSingleImage = async (imageBuffer: ArrayBuffer | ArrayBufferLike) => {
        const buffer = imageBuffer instanceof ArrayBuffer ? imageBuffer : new Uint8Array(imageBuffer).buffer;
        const result = await Tesseract.recognize(Buffer.from(buffer), "chi_sim");
        return result.data.text;
    }
    return {
        scanImage: scanSingleImage,
        scanPdf: async (pdfBuffer) => {
            const document = await pdf(Buffer.from(pdfBuffer), { scale: 1 });

            const result = [];

            for await (const page of document) {
                const text = await scanSingleImage(page.buffer);
                result.push(text);
            }

            return result.join("\n");
        },
    }
}
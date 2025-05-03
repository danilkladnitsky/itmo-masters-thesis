import Tesseract from "tesseract.js";

import type { IImageScannerModule } from "./types";

export const createImageScannerModule = (): IImageScannerModule => {
    return {
        scanImage: async (imageBuffer) => {
            const result = await Tesseract.recognize(Buffer.from(imageBuffer), "chi_sim");
            return result.data.text;
        }
    }
}
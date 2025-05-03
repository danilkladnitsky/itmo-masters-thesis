import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic"

import type { IImageScannerModule } from "./types";

export const createImageScannerModule = (): IImageScannerModule => {
    const scanSingleImage = async (imageBuffer: ArrayBuffer) => {
        const result = await Tesseract.recognize(Buffer.from(imageBuffer), "chi_sim");
        return result.data.text;
    }
    return {
        scanImage: scanSingleImage,
        scanPdf: async (pdfBuffer) => {
            const options = {
                density: 100,
                saveFilename: "untitled",
                savePath: "./images",
                format: "png",
                width: 600,
                height: 600
              };
              const convert = fromBuffer(Buffer.from(pdfBuffer), options);
              const pageToConvertAsImage = 1;
              
            const result = await convert(pageToConvertAsImage, { responseType: "image" })

            console.log(result)

            return "scanned";
        },
    }
}
export interface IImageScannerModule {
    scanImage: (image: ArrayBuffer) => Promise<string>;
    scanPdf: (pdf: ArrayBuffer) => Promise<string>;
}

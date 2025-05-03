export interface IImageScannerModule {
    scanImage: (image: ArrayBuffer) => Promise<string>;
}

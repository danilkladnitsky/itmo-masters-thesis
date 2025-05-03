export interface IYoutubeDownloaderModule {
    extractCaptions(videoUrl: string): Promise<any>
}
export interface IYoutubeCaptionsModule {
    extractCaptions(videoUrl: string): Promise<string>
}
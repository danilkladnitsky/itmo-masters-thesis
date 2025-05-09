import type { IYoutubeCaptionsModule } from "@/module/youtube-captions/types"

export interface IYoutubeCaptionsController {
    extractCaptions: (request: Request) => Promise<Response>
}

export type CreateYoutubeCaptionsController = {youtubeCaptionsModule: IYoutubeCaptionsModule}

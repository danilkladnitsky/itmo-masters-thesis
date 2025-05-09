import type { IS3Module } from "@/module/s3/types"
import type { IYoutubeCaptionsModule } from "@/module/youtube-captions/types"

export interface IYoutubeCaptionsController {
    extractCaptions: (request: Request) => Promise<Response>
}

export type CreateYoutubeCaptionsController = {
    youtubeCaptionsModule: IYoutubeCaptionsModule,
    s3Module: IS3Module
}

import type { CreateYoutubeCaptionsController } from "./types"

export const createYoutubeCaptionsController = ({youtubeCaptionsModule}: CreateYoutubeCaptionsController) => {
    return {
        extractCaptions: async (request: Request) => {
            try {
                const { videoUrl } = await request.json()
                const captions = await youtubeCaptionsModule.extractCaptions(videoUrl)
                return new Response(captions, { status: 200 })
            } catch (error) {
                console.error(error)
                return new Response(error as string, { status: 500 })
            }
        }
    }
}
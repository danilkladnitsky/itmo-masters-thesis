import type { CreateYoutubeCaptionsController } from "./types"

export const createYoutubeCaptionsController = ({youtubeCaptionsModule, s3Module}: CreateYoutubeCaptionsController) => {
    return {
        extractCaptions: async (request: Request) => {
            try {
                // https://www.youtube.com/watch?v=08WJ4Woaw4w
                const { videoUrl } = await request.json()
                const captions = await youtubeCaptionsModule.extractCaptions(videoUrl)

                const videoId = videoUrl.split("v=")[1]

                const fileName = `${videoId}.txt`

                const fileUrl = await s3Module.uploadTextFile(fileName, captions)

                return new Response(fileUrl, { status: 200 })
            } catch (error) {
                console.error(error)
                return new Response(error as string, { status: 500 })
            }
        }
    }
}
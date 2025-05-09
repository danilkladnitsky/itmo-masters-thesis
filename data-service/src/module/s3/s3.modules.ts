import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import type { CreateS3Module, IS3Module } from "./types"

export const createS3Module = ({region, bucketName, url, accessKeyId, secretAccessKey}: CreateS3Module): IS3Module => {
    const s3 = new S3Client({
        region,
        endpoint: url,
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
    })

    return {
        uploadTextFile: async (fileName: string, content: string) => {
            const command = new PutObjectCommand({ Bucket: bucketName, Key: fileName, Body: content })
            await s3.send(command)
            return `${url}/${bucketName}/${fileName}`
        }
    }
}
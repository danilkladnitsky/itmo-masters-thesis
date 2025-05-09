export interface IS3Module {
    uploadTextFile(fileName: string, content: string): Promise<string>
}

export type CreateS3Module = {
    region: string;
    bucketName: string;
    url: string;
    accessKeyId: string;
    secretAccessKey: string;
}
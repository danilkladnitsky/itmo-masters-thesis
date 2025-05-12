export type LLMInput = { 
    role: string;
    content: string;
}

export type LLMOutput = {
    ok: true;
    content: string;
} | {
    ok: false;
    error: string;
}

export type LLMOptions = {
    model: string;
    temperature: number;
    maxTokens: number;
}

export type ImageResource = {
    id: string;
    file: File;
}

export type YoutubeVideoResource = {
    id: string;
    url: string;
}

export type PromptResource = {
    id: string;
    text: string;
}

export type DatasetResources = {
    modelName: string;
    modelDescription: string;
    hskLevel: number;
    promptList?: PromptResource[];
    videoUrlList?: YoutubeVideoResource[];
    images?: ImageResource[];
}
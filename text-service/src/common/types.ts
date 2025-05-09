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

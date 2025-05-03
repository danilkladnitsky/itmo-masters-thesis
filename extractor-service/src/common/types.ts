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
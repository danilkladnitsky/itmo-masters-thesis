export type LLMInput = {
  role: string;
  content: string;
};

export type LLMOutput = string

export type LLMResponse =
  | {
      output: null;
      ok: false;
      error: string;
    }
  | {
      output: LLMOutput;
      ok: true;
      error: null;
    };

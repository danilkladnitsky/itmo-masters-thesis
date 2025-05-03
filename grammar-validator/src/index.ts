import { createLLMModule } from "@/modules/llm/llm.module";
import { createHttpModule } from "@/modules/http/http.module";

const llm = createLLMModule({ model: "llama2-chinese" });
const http = createHttpModule({ port: 3000 });


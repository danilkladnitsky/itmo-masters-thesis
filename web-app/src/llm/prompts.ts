import type { WordBundle } from "@/types"

const GAP_TASK_EXAMPLE = [
    {
      "task_id": 1,
      "sentence": [
        "我",
        "喜欢",
        "吃",
        "_"
      ],
      "options": [
        "书",
        "桌子",
        "学校",
        "苹果"
      ],
      "answer": "苹果"
    },
    {
      "task_id": 2,
      "sentence": [
        "我",
        "喜欢",
        "喝",
        "_"
      ],
      "options": [
        "水",
        "米饭",
        "苹果"
      ],
      "answer": "水"
    },
    {
      "task_id": 3,
      "sentence": [
        "他",
        "在",
        "学校",
        "_"
      ],
      "options": [
        "北京",
        "医院",
        "学习",
        "家"
      ],
      "answer": "学习"
    }
]

export const GAP_TASK_PROMPT = (wordBundles: WordBundle[]) => `
You need to generate a gap task based on the following word bundles: ${wordBundles.map(bundle => bundle.words.join(', ')).join(', ')}.
Response should be in JSON format.

Example: 
${GAP_TASK_EXAMPLE}
`
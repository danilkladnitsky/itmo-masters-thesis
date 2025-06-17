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


export const generateWordBundlesPrompt = () => {
  return `请生成6个主题词汇包。

完整版本如下：

你需要根据主题生成一个HSK 1级词汇列表。输出格式应为JSON。请生成6个主题词汇包。
例如：
[
    {
        "bundleName": "时间",
        "words": ["今天", "昨天", "明天"]
    },
    {
        "bundleName": "动物",
        "words": ["猫", "狗", "鸟"]
    }
]
`
}
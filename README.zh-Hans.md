# 英语句法分析器与编辑器

[한국어](README.md) · [English](README.en.md) · [简体中文](README.zh-Hans.md) · [日本語](README.ja.md)

![Syntax Analyzer](https://github.com/romantech/syntax-analyzer/assets/8604840/747803a5-7670-4c18-99b8-07c4245b5312)

Syntax Analyzer 是一款可自动分析英语句子结构并编辑分析结果的网页应用。它使用 30 多种常用语法标签，让复杂的句子结构一目了然。它还可以根据你输入的主题随机生成英语句子。

- 网页应用 · [https://syntax-analyzer.romantech.net](https://syntax-analyzer.romantech.net/)
- [Express API 文档](apps/api/README.md)
- 模型微调仓库 · [https://github.com/romantech/openai-fine-tuning](https://github.com/romantech/openai-fine-tuning)

# 目录

- [主要功能](#主要功能)
- [技术栈](#技术栈)
  - [前端](#前端)
  - [后端](#后端)
- [分析数据生成流程](#分析数据生成流程)
- [句法解析器的工作原理](#句法解析器的工作原理)
- [标签标注规则](#标签标注规则)
- [句子成分列表](#句子成分列表)
- [屏幕截图](#屏幕截图)

# 主要功能

> [!NOTE]
> 分析前会展开 `I'll` 等缩写形式，例如将 `I'll` 展开为 `I will`。既可表示所有格也可表示缩写的 `'s` 按原文分析。\
> 也会移除数字中的所有逗号，例如将 `6,500` 转为 `6500`。

1. 分析英语句子，识别主语、动词、宾语、短语和从句等成分。
2. 使用 30 多种语法标签直观呈现英语句子的结构，并编辑分析结果。
3. 根据输入的主题随机生成英语句子。

# 技术栈

### 前端

- **框架** · React + TypeScript
- **UI 库** · Chakra UI
- **CSS 预处理器** · SCSS
- **状态管理** · Jotai / React Query
- **表单处理** · React Hook Form / Yup
- **动画** · Framer Motion / Lottie

### 后端

- **框架** · Express + TypeScript
- **数据库与缓存** · Redis（使用 ioredis）
- **句法分析** · OpenAI / LangChain

# 分析数据生成流程

收到分析请求后，API 会先验证输入，再在 Redis 中预留 1 次分析额度。API 会验证 AI 的响应，如果无法根据响应中的分析范围构建句法结构，就重试一次。分析成功时，API 会返回经过验证的数据；分析失败时，会退还预留的额度。

[分析请求时序图](README.md#분석-데이터-생성-흐름)

# 句法解析器的工作原理

解析器先对输入句子进行分词，将其拆成最小的词元。词元放入根层级的片段，各片段以图结构组织。每个片段记录起止词元的索引。添加句子成分时，解析器根据词元范围查找对应的片段，按需创建新片段或合并已有片段。

1. 如果范围与当前片段完全一致，将该成分添加到当前片段。
2. 如果范围小于当前片段，查找包含该范围的子片段。
3. 如果没有子片段包含该范围，合并子片段以创建新片段。
4. 如果没有任何子片段，直接创建新片段。

下图以 `Global warming is a significant issue` 为例，展示依次在词元索引范围 `3-6`、`5-6`、`4-6` 添加句子成分时，片段如何变化。

![句法解析器创建和合并片段的过程](https://github.com/romantech/syntax-analyzer/assets/8604840/4cb5fd1c-8c73-4396-880b-ccdad38a06b2)

# 标签标注规则

标注用于表示单词、短语或从句的语法作用。标注以完整单词为单位，短语和从句的范围不能交叉。如果新范围和已有范围交叉，就需要拆开并重建已有片段。

例如，`Global warming is a significant issue` 已如下所示标注了 `S`、`V`、`C`，因此无法为 `warming is` 或 `is a significant` 添加标签。像 `Global warming is` 这样完整包含两个句子成分的范围可以添加标签。

```
[Global warming] [is] [a significant issue]
---------------- ---- ---------------------
       S          V             C

允许: Global warming is / is a significant issue
禁止: warming is / is a / is a significant
```

# 句子成分列表

[查看句子成分列表](docs/syntax-tags.zh-Hans.md)

# 屏幕截图

#### 首页

![首页](https://github.com/romantech/syntax-analyzer/assets/8604840/b09f7777-e0c9-48aa-9ad4-5de85e8eb106)

#### 英语句法分析表单

![英语句法分析表单](https://github.com/romantech/syntax-analyzer/assets/8604840/1a2e169b-d4f8-4792-8816-be42cfb153f6)

#### 英语句法编辑器

![英语句法编辑器](https://github.com/romantech/syntax-analyzer/assets/8604840/5eb8336b-fdc1-4ed0-aa0b-a88a7e576a57)

#### 随机句子生成器

![随机句子生成器](https://github.com/romantech/syntax-analyzer/assets/8604840/114fb4e4-e29a-4f65-a8c7-b9d963b39dbf)

# 英语句法分析器与编辑器

[한국어](README.md) · [English](README.en.md) · [简体中文](README.zh-Hans.md) · [日本語](README.ja.md)

![Syntax Analyzer](https://github.com/romantech/syntax-analyzer/assets/8604840/747803a5-7670-4c18-99b8-07c4245b5312)

Syntax Analyzer 是一款可自动分析英语句子结构并编辑分析结果的网页应用。它使用 30 多种常用语法标签，让复杂的句子结构一目了然。它还可以根据你输入的主题随机生成英语句子。句法分析使用 GPT-6 Luna。

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

新版本部署后，如果应用提示页面无法加载，请点击 **刷新** 重新打开当前页面。

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

```mermaid
sequenceDiagram
    autonumber

    participant C as React 客户端
    participant S as Express 服务器
    participant R as Redis 数据库
    participant O as OpenAI API

    C->>S: 发起分析请求

    activate S

    S->S: 验证请求
    Note right of S: 检查 IP 地址和请求字段

    alt 请求无效
        S-->>C: 400 错误请求

    else 请求有效
        S->>+R: 获取剩余分析次数
        R-->>-S: 返回剩余分析次数
        S->S: 检查剩余分析次数

        break 已达到上限
            S-->>C: 400 达到使用上限
        end

        else 继续处理
            critical 使用 OpenAI 分析
                S->>+O: 生成聊天补全
                O-->>-S: 返回分析结果
            end

            S->>R: 更新剩余分析次数
            Note over S,R: 分析扣除 1 次

            S-->>C: 200 OK 并返回分析数据
            deactivate S
    end
```

# 句法解析器的工作原理

解析器先对输入句子进行分词，将其拆成最小的词元。词元放入根层级的片段，各片段以图结构组织。每个片段记录起止词元的索引。添加句子成分时，解析器根据词元范围查找对应的片段，按需创建新片段或合并已有片段。

1. 如果范围与当前片段完全一致，将该成分添加到当前片段。
2. 如果范围小于当前片段，查找包含该范围的子片段。
3. 如果没有子片段包含该范围，合并子片段以创建新片段。
4. 如果没有任何子片段，直接创建新片段。

下图以 `Global warming is a significant issue` 为例，展示依次在词元索引范围 `3-6`、`5-6`、`4-6` 添加句子成分时，片段如何变化。

![句法解析器创建和合并片段的过程](https://github.com/romantech/syntax-analyzer/assets/8604840/4cb5fd1c-8c73-4396-880b-ccdad38a06b2)

# 标签标注规则

AI 分析的概览显示主语、动词、宾语、补足语和状语等句法成分。动词所要求的地点标为处所补足语。展开详情可查看副词、介词短语等形式，也可查看完成体、进行体、被动语态和 do 助动词。 **展开所有标签**可查看全部标签，选择**折叠所有标签**可返回概览。添加或删除标签时会显示全部标签。标签默认以当前界面语言的完整名称显示。开启**缩写**开关即可显示缩写。刷新页面后会保留所选设置。

在移动设备上，轻点底部工具栏中的 **选择标签**。轻点起始单词，再轻点 **应用**，即可为该单词添加标签。要标注一段文字，请依次轻点起始和结束单词，再应用标签。轻点 **取消选择** 可清除选中的范围。句子较长时，可在句子上或标签下方的空白处左右滑动。标签堆叠高度超出屏幕时，可在同一区域上下滑动。内容超出显示区域时，垂直滚动条显示在标签区域右侧，水平滚动条显示在下方。删除模式下，轻点要删除的标签。

即使另一个浏览器标签页更改了列表顺序，标注仍会保存到开始编辑的那条句子。如果句子已被删除，编辑器会提示无法保存。

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

分析器按下列语法类别分析英语句子，编辑器也使用这些类别作为标签。开启**标签说明**后，可在标签选择列表中查看各语法类别的说明。单个单词视为词元（token），由两个或更多单词构成的成分按语法结构分为短语（phrase）或分句（clause）。

| 标签           | 缩写     | 类型   | 说明                                         |
| -------------- | -------- | ------ | -------------------------------------------- |
| 主语           | s        | token  | 表示句子所陈述的人或事物的单词或短语         |
| 动词           | v        | token  | 表示动作或状态的词                           |
| 情态动词       | mod      | token  | 与其他动词连用以增添含义的动词               |
| 宾语           | o        | token  | 受动词所表达的动作或状态影响的单词或短语     |
| 间接宾语       | i.o.     | token  | 表示动作接受者或受益者的单词或短语           |
| 直接宾语       | d.o.     | token  | 直接受到动词动作影响的单词或短语             |
| 介词宾语       | prp.o.   | token  | 由介词引出的单词或短语                       |
| 补语           | c        | token  | 描述主语或宾语，或补足其含义的单词或短语     |
| 宾语补足语     | o.c.     | token  | 描述宾语或补足其含义的单词或短语             |
| 主语补足语     | s.c.     | token  | 说明主语的身份或状态的成分                   |
| 状语           | advl     | token  | 为小句补充时间、地点、方式或原因等信息的成分 |
| 处所补足语     | loc.c.   | token  | 表示动词所要求的地点或方向的成分             |
| 完成体助动词   | perf.aux | token  | 与过去分词搭配构成完成体的 have              |
| 进行体助动词   | prog.aux | token  | 与现在分词搭配构成进行体的 be                |
| 被动语态助动词 | pass.aux | token  | 与过去分词搭配构成被动语态的 be              |
| do 助动词      | do.aux   | token  | 用于构成疑问句、否定句或表示强调的 do        |
| 带 to 的不定式 | to-inf   | token  | 与 to 连用的动词原形                         |
| 动名词         | g        | token  | 用作名词的动词 -ing 形式                     |
| 分词           | pt       | token  | 动词的现在分词或过去分词形式                 |
| 连词           | conj     | token  | 连接语法成分的词                             |
| 副词           | adv      | token  | 修饰动词、形容词或副词的词                   |
| 分词短语       | pt.phr   | phrase | 由分词及其相关成分构成的短语                 |
| 介词短语       | prp.phr  | phrase | 由介词及其宾语构成的短语                     |
| 名词短语       | n.phr    | phrase | 由名词及其修饰语构成的短语                   |
| 副词短语       | adv.phr  | phrase | 在句中起副词作用的短语                       |
| 动词短语       | v.phr    | phrase | 在句中起动词作用的短语                       |
| 形容词短语     | adj.phr  | phrase | 在句中起形容词作用的短语                     |
| 动名词短语     | g.phr    | phrase | 由动名词及其相关词语构成的短语               |
| 不定式短语     | inf.phr  | phrase | 由 to、动词原形及相关成分构成的短语          |
| 并列分句       | co.cl    | clause | 两个或更多语法地位相同的分句之一             |
| 平行分句       | p.cl     | clause | 两个或更多语法结构相同的分句之一             |
| 名词性从句     | n.cl     | clause | 在句中起名词作用的从句                       |
| 形容词性从句   | adj.cl   | clause | 在句中起形容词作用的从句                     |
| 状语从句       | adv.cl   | clause | 在句中起副词作用的从句                       |
| 插入分句       | i.cl     | clause | 插入另一分句中的分句                         |
| 关系从句       | rel.cl   | clause | 补充说明主句中相关成分的从句                 |
| 从属分句       | dep.cl   | clause | 依赖另一分句才能表达完整含义的分句           |
| 独立分句       | ind.cl   | clause | 能够独立表达完整含义的分句                   |

# 屏幕截图

#### 首页

![首页](https://github.com/romantech/syntax-analyzer/assets/8604840/b09f7777-e0c9-48aa-9ad4-5de85e8eb106)

#### 英语句法分析表单

![英语句法分析表单](https://github.com/romantech/syntax-analyzer/assets/8604840/1a2e169b-d4f8-4792-8816-be42cfb153f6)

#### 英语句法编辑器

![英语句法编辑器](https://github.com/romantech/syntax-analyzer/assets/8604840/5eb8336b-fdc1-4ed0-aa0b-a88a7e576a57)

#### 随机句子生成器

![随机句子生成器](https://github.com/romantech/syntax-analyzer/assets/8604840/114fb4e4-e29a-4f65-a8c7-b9d963b39dbf)

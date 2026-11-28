# English Syntax Analyzer and Editor

[한국어](README.md) · [English](README.en.md) · [简体中文](README.zh-Hans.md) · [日本語](README.ja.md)

![Syntax Analyzer](https://github.com/romantech/syntax-analyzer/assets/8604840/747803a5-7670-4c18-99b8-07c4245b5312)

Syntax Analyzer is a web app that automatically analyzes English sentence structure and lets you edit the results. It uses more than 30 common grammar tags to show how complex sentences fit together. It can also generate random sentences on the topics you enter.

- [Web app](https://syntax-analyzer.romantech.net/)
- [API reference](apps/api/README.md)
- [Local development and API change guide](docs/api-integration.md)

# Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [How Analysis Data Is Generated](#how-analysis-data-is-generated)
- [How the Parser Works](#how-the-parser-works)
- [Tagging Rules](#tagging-rules)
- [Sentence Constituents](#sentence-constituents)
- [Screenshots](#screenshots)
- [License](#license)

# Features

> [!NOTE]
> Before analysis, the app expands contractions such as `I'll` to `I will`. It keeps ambiguous `'s` endings as written.\
> It also removes all commas from numbers, so `6,500` becomes `6500`.

1. Analyze English sentences to identify subjects, verbs, objects, phrases, clauses, and other constituents.
2. Edit English syntax and visualize sentence structure with more than 30 grammar tags.
3. Generate random English sentences on the topics you enter.

After choosing `Expand all tags`, use the arrow next to a label to collapse or reopen that group's details.

# Tech Stack

### Frontend

- **Framework** · React with TypeScript
- **UI Library** · Chakra UI
- **CSS Preprocessor** · SCSS
- **State Management** · Jotai / React Query
- **Form Handling** · React Hook Form / Yup
- **Animation** · Framer Motion / Lottie

### Backend

- **Framework** · Express with TypeScript
- **Database and Cache** · Redis (using ioredis)
- **Syntax Analysis** · OpenAI / LangChain

# How Analysis Data Is Generated

When an analysis request comes in, the API validates the input and reserves one analysis credit in Redis. It validates the AI response and retries once if it cannot build a syntax structure from the spans in the response. If the analysis succeeds, the API returns the validated data. If it fails, the API refunds the reserved credit.

[Analysis request sequence diagram](README.md#분석-데이터-생성-흐름)

# How the Parser Works

The parser starts by tokenizing the input sentence. It puts the tokens in a root segment and organizes segments as a graph. Each segment records its start and end token indices. To add a constituent, the parser searches for segments that cover its token range and creates or combines segments as needed.

1. If the range matches the current segment, add the constituent to that segment.
2. If the range is shorter than the current segment, look for a child segment that contains it.
3. If no child segment contains the range, combine child segments to create a new segment.
4. If there are no child segments, create a new segment.

The diagram below shows how the segments for `Global warming is a significant issue` change as constituents are added at token ranges `3-6`, `5-6`, and `4-6`.

![How the parser adds and combines segments](https://github.com/romantech/syntax-analyzer/assets/8604840/4cb5fd1c-8c73-4396-880b-ccdad38a06b2)

# Tagging Rules

Tagging identifies the grammatical role of a word, phrase, or clause. Tags are applied to whole words, and phrase or clause ranges cannot cross. A crossing range would require breaking apart and rebuilding existing segments.

For example, when `Global warming is a significant issue` already has the `S`, `V`, and `C` tags shown below, you cannot tag `warming is` or `is a significant`. You can tag a range such as `Global warming is` that fully contains both constituents.

```
[Global warming] [is] [a significant issue]
---------------- ---- ---------------------
       S          V             C

Allowed: Global warming is / is a significant issue
Disallowed: warming is / is a / is a significant
```

# Sentence Constituents

[View the list of sentence constituents](docs/syntax-tags.en.md)

# Screenshots

#### Home

![Home](https://github.com/romantech/syntax-analyzer/assets/8604840/b09f7777-e0c9-48aa-9ad4-5de85e8eb106)

#### English Syntax Analysis Form

![English Syntax Analysis Form](https://github.com/romantech/syntax-analyzer/assets/8604840/1a2e169b-d4f8-4792-8816-be42cfb153f6)

#### English Syntax Editor

![English Syntax Editor](https://github.com/romantech/syntax-analyzer/assets/8604840/5eb8336b-fdc1-4ed0-aa0b-a88a7e576a57)

#### Random Sentence Generator

![Random Sentence Generator](https://github.com/romantech/syntax-analyzer/assets/8604840/114fb4e4-e29a-4f65-a8c7-b9d963b39dbf)

# License

[![License: AGPL-3.0-only](https://img.shields.io/badge/License-AGPL--3.0--only-blue.svg)](LICENSE)

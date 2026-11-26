# 英語構文アナライザーとエディター

[한국어](README.md) · [English](README.en.md) · [简体中文](README.zh-Hans.md) · [日本語](README.ja.md)

![Syntax Analyzer](https://github.com/romantech/syntax-analyzer/assets/8604840/747803a5-7670-4c18-99b8-07c4245b5312)

Syntax Analyzer は、英文の構造を自動で分析し、その結果を自由に編集できるウェブアプリです。よく使われる30種類以上の文法タグで、複雑な英文の構造をひと目で確認できます。入力したトピックに沿って英文をランダムに生成することもできます。

- ウェブアプリ · [https://syntax-analyzer.romantech.net](https://syntax-analyzer.romantech.net/)
- [Express API リファレンス](apps/api/README.md)
- ファインチューニングのリポジトリ · [https://github.com/romantech/openai-fine-tuning](https://github.com/romantech/openai-fine-tuning)

# 目次

- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
  - [フロントエンド](#フロントエンド)
  - [バックエンド](#バックエンド)
- [分析データの生成フロー](#分析データの生成フロー)
- [構文解析の仕組み](#構文解析の仕組み)
- [タグ付けの制約](#タグ付けの制約)
- [文の構成要素](#文の構成要素)
- [スクリーンショット](#スクリーンショット)

# 主な機能

> [!NOTE]
> 分析前に `I'll` などの短縮形を展開します（`I'll` → `I will`）。所有格にも短縮形にもなる `'s` は入力のまま分析します。\
> 数値に含まれるカンマはすべて取り除きます（`6,500` → `6500`）。

1. 英文を分析し、主語・動詞・目的語・句・節などの構成要素を特定します。
2. 30種類以上の文法タグで英文の構造を可視化し、分析結果を編集できます。
3. 入力したトピックに沿って英文をランダムに生成できます。

# 技術スタック

### フロントエンド

- **フレームワーク** · React + TypeScript
- **UI ライブラリ** · Chakra UI
- **CSS プリプロセッサー** · SCSS
- **状態管理** · Jotai / React Query
- **フォーム管理** · React Hook Form / Yup
- **アニメーション** · Framer Motion / Lottie

### バックエンド

- **フレームワーク** · Express + TypeScript
- **データベースとキャッシュ** · Redis（ioredis を使用）
- **構文分析** · OpenAI / LangChain

# 分析データの生成フロー

分析リクエストを受け取ると、入力値を検証してから Redis で分析1回分の利用枠を確保します。AI の応答を検証し、応答に含まれる分析範囲から構文構造を構成できない場合は、1回だけ再試行します。分析に成功した場合は検証済みのデータを返し、失敗した場合は確保した利用枠を戻します。

[分析リクエストのシーケンス図](README.md#분석-데이터-생성-흐름)

# 構文解析の仕組み

まず、入力された英文をトークン化し、最小単位に分割します。トークンはルート（最上位）のセグメントに入れ、セグメントをグラフ構造で管理します。各セグメントは開始位置と終了位置のトークンインデックスを保持します。文の構成要素を追加するときは、該当するトークン範囲を対象にセグメントを探し、必要に応じて新しいセグメントを作成したり、既存のセグメントを結合したりします。

1. 範囲が現在のセグメントと一致する場合は、そのセグメントに構成要素を追加します。
2. 範囲が現在のセグメントより狭い場合は、その範囲を含む子セグメントを探します。
3. 範囲を含む子セグメントがない場合は、子セグメントを結合して新しいセグメントを作成します。
4. 子セグメントが一つもない場合は、新しいセグメントを作成します。

下の図は、`Global warming is a significant issue` のトークン範囲 `3-6`、`5-6`、`4-6` に構成要素を順に追加すると、セグメントがどう変わるかを示しています。

![構文解析でセグメントを作成・結合する流れ](https://github.com/romantech/syntax-analyzer/assets/8604840/4cb5fd1c-8c73-4396-880b-ccdad38a06b2)

# タグ付けの制約

タグ付けでは、単語や句・節の文法上の役割を示します。タグは単語単位で付け、句や節の範囲は交差できません。既存の範囲と交差するタグを付けると、構築済みのセグメントを分解して組み直す必要があるためです。

たとえば、`Global warming is a significant issue` に下のように `S`、`V`、`C` のタグが付いている場合、`warming is` や `is a significant` にはタグを付けられません。`Global warming is` のように、二つの構成要素を丸ごと含む範囲にはタグを付けられます。

```
[Global warming] [is] [a significant issue]
---------------- ---- ---------------------
       S          V             C

許可: Global warming is / is a significant issue
禁止: warming is / is a / is a significant
```

# 文の構成要素

[文の構成要素の一覧を見る](docs/syntax-tags.ja.md)

# スクリーンショット

#### ホーム画面

![ホーム画面](https://github.com/romantech/syntax-analyzer/assets/8604840/b09f7777-e0c9-48aa-9ad4-5de85e8eb106)

#### 英文の構文分析フォーム

![英文の構文分析フォーム](https://github.com/romantech/syntax-analyzer/assets/8604840/1a2e169b-d4f8-4792-8816-be42cfb153f6)

#### 英文の構文エディター

![英文の構文エディター](https://github.com/romantech/syntax-analyzer/assets/8604840/5eb8336b-fdc1-4ed0-aa0b-a88a7e576a57)

#### ランダム英文生成

![ランダム英文生成](https://github.com/romantech/syntax-analyzer/assets/8604840/114fb4e4-e29a-4f65-a8c7-b9d963b39dbf)

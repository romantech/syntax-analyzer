# Syntax Analyzer

Below are the API specifications for the [Syntax Analyzer](https://github.com/romantech/syntax-analyzer) project, offering features such as syntax analysis and random sentence generation.

### Analyze Sentence Syntax

This endpoint uses specified AI models to analyze the syntax of tokenized sentences, breaking them down into grammatical elements for detailed structural insights.

#### Endpoint

```
POST /analyzer
```

#### Request Body

| Field      | Type            | Options                              | Required | Description                                | Constraints                                  |
| ---------- | --------------- | ------------------------------------ | -------- | ------------------------------------------ | -------------------------------------------- |
| `model`    | `string`        | `primary`, `primary-ft`, `fast-ft` | Yes      | Analysis model key (provider model alias) | One of: `primary`, `primary-ft`, `fast-ft` |
| `sentence` | `Array<string>` | N/A                                  | Yes      | Tokens for analysis                        | Range: 2~20 tokens                           |

> Example Request

```json
{
  "model": "fast-ft",
  "sentence": ["My", "name", "is", "John", "."]
}
```

#### Quota Consumption

- `model=primary`: 2 analysis credits
- `model=primary-ft`: 2 analysis credits
- `model=fast-ft`: 1 analysis credit

#### Response

> Analysis Data Model

```tsx
type AnalysisSource = 'user' | 'sample';
type ISODateString = string;
type ConstituentType = 'clause' | 'phrase' | 'token';

type TConstituent = {
  id: number; // Random 9-digit number
  elementId: number; // Constituent ID
  label: string; // Grammatical label, e.g., "subject"
  abbreviation: string; // Abbreviation, e.g., "s"
  type: ConstituentType; // Type of constituent
};

type TSegment = {
  id: number; // Random 9-digit number
  begin: number; // Start index
  end: number; // End index
  constituents: TConstituent[]; // Segment constituents
  children: TSegment[]; // Sub-segments
};

type TAnalysis = {
  id: string; // Random 21-byte string
  source: AnalysisSource; // Data source
  createdAt: ISODateString; // ISO 8601 timestamp
  sentence: string[]; // Tokenized sentence
  rootSegment: TSegment; // Root segment
  isAnalyzedByGPT: boolean; // AI-analyzed status
};
```

<details><summary>200 OK</summary>
<br />

```json
{
  "id": "YW6AX-AOZb2-xYXt05xkn",
  "source": "user",
  "createdAt": "2023-05-10T23:08:08.000Z",
  "sentence": ["My", "name", "is", "John", "."],
  "rootSegment": {
    "id": 840296172,
    "begin": 0,
    "end": 5,
    "constituents": [],
    "children": [
      {
        "id": 987654321,
        "begin": 0,
        "end": 2,
        "constituents": [
          {
            "id": 456789123,
            "elementId": 1,
            "label": "subject",
            "abbreviation": "s",
            "type": "token"
          }
        ],
        "children": []
      },
      {
        "id": 789123456,
        "begin": 2,
        "end": 3,
        "constituents": [
          {
            "id": 321654987,
            "elementId": 2,
            "label": "verb",
            "abbreviation": "v",
            "type": "token"
          }
        ],
        "children": []
      },
      {
        "id": 654321789,
        "begin": 3,
        "end": 4,
        "constituents": [
          {
            "id": 654987321,
            "elementId": 5,
            "label": "object",
            "abbreviation": "o",
            "type": "token"
          }
        ],
        "children": []
      },
      {
        "id": 321789654,
        "begin": 4,
        "end": 5,
        "constituents": [],
        "children": []
      }
    ]
  },
  "isAnalyzedByGPT": true
}
```
</details>

<details><summary>400 Bad Request</summary>
<br />

```json
{
  "errors": [
    {
      "type": "field",
      "value": "value that caused the error",
      "msg": "Error description",
      "path": "field_name",
      "location": "body"
    }
  ]
}
```
</details>

### Generate random sentences

This endpoint generates random sentences, optionally constrained by sentence count, character limit, and topics.

#### Endpoint

```
GET /analyzer/random-sentences
```

#### Request Parameters

| Field        | Type            | Required | Default | Description                    | Constraints  |
| ------------ | --------------- | -------- | ------- | ------------------------------ | ------------ |
| `sent_count` | `number`        | No       | `3`     | Quantity of sentences          | Range: 1~5   |
| `max_chars`  | `number`        | No       | `80`    | Character limit per sentence   | Range: 10~80 |
| `topics`     | `Array<string>` | No       | `[]`    | Topics to include in sentences | Max 3 topics |

#### Response

<details><summary>200 OK</summary>
<br />

```json
[
  "Apples are a popular fruit that come in many different varieties.",
  "Apple trees are typically grown in orchards for commercial production.",
  "Apple cider is a refreshing beverage made from pressed apples.",
]
```
</details>

<details><summary>400 Bad Request</summary>
<br />

```json
{
  "errors": [
    {
      "type": "field",
      "value": "value that caused the error",
      "msg": "Error description",
      "path": "field_name",
      "location": "query"
    }
  ]
}
```
</details>

### Shared quota behavior

- Each model request reserves credits from both the IP-based and shared quotas before calling the model. Random sentence generation reserves one credit per request regardless of the number of sentences.
- If either quota has insufficient credits, the API returns HTTP 400 with `{"status":"error","message":"No remaining request count available."}`.
- The first balance lookup or reservation on a new date in Korea Standard Time resets both shared balances atomically. Redis provides the clock and stores the period across API restarts.
- An existing shared balance without a recorded reset date is initialized on its first lookup or reservation after the update.
- A failed model request returns credits to the quota buckets that still match the reservation. Each IP quota expires 24 hours after initialization.

### Check remaining counts

This endpoint initializes the IP quota on first use and returns the smaller of the IP and shared balances for each operation. In-flight reservations are included in the balance.

#### Endpoint

```
GET /analyzer/remaining-counts
```

#### Response

<details><summary>200 OK</summary>
<br />

```json
{
  "analysis": 10,
  "random_sentence": 20
}
```
- `analysis` : Remaining count for syntax analysis
- `random_sentence` : Remaining count for random sentence generation
</details>

<details><summary>400 Bad Request</summary>
<br />

```json
{
  "status": "error",
  "message": "Error description"
}
```
</details>

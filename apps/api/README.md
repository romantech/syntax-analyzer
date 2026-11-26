# Syntax Analyzer

Below are the API specifications for the [Syntax Analyzer](https://github.com/romantech/syntax-analyzer) project, offering features such as syntax analysis and random sentence generation.

### Check process health and Redis readiness

| Endpoint | Response |
| --- | --- |
| `GET /health` | HTTP 200 while the API process is serving HTTP |
| `GET /ready` | HTTP 200 with `{"status":"OK"}` when Redis answers `PING` within one second, or HTTP 503 with `{"status":"UNAVAILABLE"}` when Redis is disconnected, the command fails, or the deadline expires |

Readiness responses are served with `Cache-Control: no-store`.

### Analyze Sentence Syntax

Analyzes the syntax of a tokenized English sentence using GPT-6 Luna by default.

#### Endpoint

```
POST /analyzer
```

#### Request Body

| Field      | Type            | Options                              | Required | Description                                | Constraints                                  |
| ---------- | --------------- | ------------------------------------ | -------- | ------------------------------------------ | -------------------------------------------- |
| `model`    | `string`        | `primary`, `primary-ft`, `fast-ft` | Yes      | Compatibility key for existing clients | One of: `primary`, `primary-ft`, `fast-ft` |
| `sentence` | `Array<string>` | N/A                                  | Yes      | Tokens for analysis                        | 2–20 tokens, each a non-blank string of up to 80 characters |

> Example Request

```json
{
  "model": "fast-ft",
  "sentence": ["My", "name", "is", "John", "."]
}
```

#### Quota Consumption

Each successful analysis uses one credit. All accepted request keys use the configured syntax analysis model. See [quota behavior](#shared-quota-behavior) for reservation and refund rules.

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
| `sent_count` | `integer`       | No       | `3`     | Quantity of sentences          | 1–5 |
| `max_chars`  | `integer`       | No       | `80`    | Character limit per sentence   | 10–80 |
| `topics`     | `Array<string>` | No       | `[]`    | Topics to include in sentences | Up to 3 topics, each a non-blank string of up to 20 characters |

Omit a parameter to use its default. Supply `sent_count` and `max_chars` once each. Use `topics=sports&topics=travel` or `topics[]=sports&topics[]=travel` for multiple topics.

#### Response

The response contains exactly `sent_count` non-blank strings. The `max_chars` limit applies to each returned string, including any leading or trailing whitespace.

<details><summary>200 OK</summary>
<br />

```json
[
  "Apples are a popular fruit that come in many different varieties.",
  "Apple trees are typically grown in orchards for commercial production.",
  "Apple cider is a refreshing beverage made from pressed apples."
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

<details><summary>502 Bad Gateway</summary>
<br />

If the model returns the wrong number of sentences, a blank sentence, or a sentence that exceeds the character limit, the API refunds eligible quota reservations and returns:

```json
{
  "status": "error",
  "message": "Invalid generated sentences."
}
```
</details>

### Request body errors

The server returns `{"status":"error","message":"Invalid request body."}` with HTTP 400 when it cannot parse JSON. Requests over the 100 KiB body limit return HTTP 413 with `{"status":"error","message":"Request body too large."}`. Field validation errors return the `errors` array shown above.

### Shared quota behavior

- The three analyzer endpoints accept `X-Analyzer-Browser: 1`. When cookie signing is configured, the API uses an existing signed anonymous browser cookie or issues a new one. The cookie lasts 30 days and identifies the same browser across networks. In production it uses `Secure`, `HttpOnly`, and `SameSite=Lax`.
- For requests without browser identification, the per-client balance is keyed by IP. The separate IP cap is shared by browser and legacy requests.

| Operation | Shared | Per browser or legacy IP | Per-IP cap |
| --- | ---: | ---: | ---: |
| Syntax analysis | 100 | 10 | 20 |
| Random sentence generation | 100 | 20 | 20 |

- After validation, each analysis or generation request reserves one credit from all three quotas before calling the model. This also applies to requests that generate multiple sentences.
- If any quota has insufficient credits, the API returns HTTP 400 with `{"status":"error","message":"No remaining request count available."}`.
- The first balance lookup or reservation on a new date in Korea Standard Time resets both shared balances atomically. Redis provides the clock and stores the period across API restarts.
- Per-client and IP quotas expire 24 hours after initialization. A failed operation returns credits to the quota buckets that still match the reservation without extending their expiry.

### Check remaining counts

For each operation, this endpoint returns the lowest balance across the shared quota, the per-client quota, and the IP cap, with in-flight reservations already deducted.

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

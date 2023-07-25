export type ConstituentType = 'clause' | 'phrase' | 'token';

export type Constituent = {
  id: number; // A random 9-digit number
  label: string; // Grammatical constituent name in lowercase
  abbreviation: string; // Abbreviated constituent name in lowercase
  type: ConstituentType; // Constituent type
  comment?: string; // Optional comment
};

export type Segment = {
  id: number; // A random 9-digit number
  begin: number; // Start token index
  end: number; // End token index
  constituents: Constituent[]; // Can be empty
  children: Segment[]; // Can be empty
};

export type Analysis = {
  id: string; // A random string of 21 bytes
  sentence: string[]; // Tokenized sentence
  rootSegment: Segment; // The array contains only a single root segment
};
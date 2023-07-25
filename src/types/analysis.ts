export type TagType = 'clause' | 'phrase' | 'token';

export type Tag = {
  id: number; // Random 9-digit number
  label: string; // Grammatical constituent name in lowercase
  abbreviation: string; // Abbreviated constituent name in lowercase
  type: TagType; // Constituent type
  comment?: string; // Optional comment
};

export type Segment = {
  id: number; // Random 9-digit number
  begin: number; // Start token index
  end: number; // End token index
  tag: Tag[]; // Can be empty
  children: Segment[]; // Can be empty
};

export type Analysis = {
  id: string; // Random UUID v4
  sentence: string[]; // Tokenized sentence
  segments: [Segment]; // The array contains only a single root segment
};

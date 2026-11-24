export const ABBREVIATIONS: Record<string, string> = {
  // Leave ambiguous 's in place so the analyzer can distinguish possession, is, and has.
  "'ll": ' will',
  "'ve": ' have',
  "'re": ' are',
  "'d": ' would',
  "'m": ' am',
  "can't": 'cannot',
  "couldn't": 'could not',
  "shouldn't": 'should not',
  "won't": 'will not',
  "wouldn't": 'would not',
  "doesn't": 'does not',
  "don't": 'do not',
  "didn't": 'did not',
  "n't": ' not',
  "ain't": 'am not', // or 'is not', 'are not', 'has not', 'have not' based on context
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "hasn't": 'has not',
  "haven't": 'have not',
  "isn't": 'is not',
  "i'm": 'I am',
  "i've": 'I have',
  "i'd": 'I would', // or 'I had' based on context
  "i'll": 'I will',
  "you're": 'you are',
  "you've": 'you have',
  "you'd": 'you would', // or 'you had' based on context
  "you'll": 'you will',
  "let's": 'let us',
  "they're": 'they are',
  "they've": 'they have',
  "they'd": 'they would', // or 'they had' based on context
  "they'll": 'they will',
};

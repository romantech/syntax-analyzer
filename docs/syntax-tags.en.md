# Sentence Constituents

The analyzer uses the grammatical categories below, and the editor uses them as tags. Turn on **Tag descriptions** to see what each grammatical category means in the tag picker. The table shows each tag’s base type. The analysis uses `token-group` when a `token` tag, such as a subject, spans multiple words.

| Label                 | Abbreviation | Type   | Description                                                                            |
| --------------------- | ------------ | ------ | -------------------------------------------------------------------------------------- |
| Subject               | s            | token  | A word or phrase that tells who or what the sentence is about                          |
| Verb                  | v            | token  | A word that expresses an action or a state in a sentence                               |
| Modal verb            | mod          | token  | A verb used with another verb to add meaning                                           |
| Object                | o            | token  | A word or phrase affected by the action or state expressed by the verb                 |
| Indirect object       | i.o.         | token  | A word or phrase that indicates the recipient or beneficiary of an action              |
| Direct object         | d.o.         | token  | A word or phrase directly affected by the action of a verb                             |
| Prepositional object  | prp.o.       | token  | A word or phrase introduced by a preposition                                           |
| Complement            | c            | token  | A word or phrase that describes or completes the meaning of the subject or object      |
| Object complement     | o.c.         | token  | A word or phrase that describes or completes the meaning of the object                 |
| Subject complement    | s.c.         | token  | A constituent that identifies or describes the subject                                 |
| Adverbial             | advl         | token  | A constituent that adds information such as time, place, manner, or reason to a clause |
| Locative complement   | loc.c.       | token  | A constituent that supplies a place or direction required by the verb                  |
| Perfect auxiliary     | perf.aux     | token  | Have used with a past participle to form the perfect                                   |
| Progressive auxiliary | prog.aux     | token  | Be used with a present participle to form the progressive                              |
| Passive auxiliary     | pass.aux     | token  | Be used with a past participle to form the passive                                     |
| Do-support auxiliary  | do.aux       | token  | Do used to form questions, negation, or emphasis                                       |
| To-infinitive         | to-inf       | token  | The base form of a verb used with to                                                   |
| Gerund                | g            | token  | The -ing form of a verb used as a noun                                                 |
| Participle            | pt           | token  | The present or past participle form of a verb                                          |
| Conjunction           | conj         | token  | A word that connects grammatical elements                                              |
| Adverb                | adv          | token  | A word that modifies a verb, adjective, or adverb                                      |
| Participle phrase     | pt.phr       | phrase | A phrase made up of a participle and its related elements                              |
| Prepositional phrase  | prp.phr      | phrase | A phrase consisting of a preposition and its object                                    |
| Noun phrase           | n.phr        | phrase | A phrase consisting of a noun and its modifiers                                        |
| Adverbial phrase      | adv.phr      | phrase | A phrase that functions as an adverb in a sentence                                     |
| Verb phrase           | v.phr        | phrase | A phrase that functions as a verb in a sentence                                        |
| Adjectival phrase     | adj.phr      | phrase | A phrase that functions as an adjective in a sentence                                  |
| Gerund phrase         | g.phr        | phrase | A phrase consisting of a gerund and related words                                      |
| Infinitive phrase     | inf.phr      | phrase | A phrase consisting of to, the base form of a verb, and related elements               |
| Coordinating clause   | co.cl        | clause | One of two or more clauses of equal grammatical status                                 |
| Parallel clause       | p.cl         | clause | One of two or more clauses with the same grammatical structure                         |
| Noun clause           | n.cl         | clause | A clause that functions as a noun in a sentence                                        |
| Adjectival clause     | adj.cl       | clause | A clause that functions as an adjective in a sentence                                  |
| Adverbial clause      | adv.cl       | clause | A clause that functions as an adverb in a sentence                                     |
| Inserted clause       | i.cl         | clause | A clause inserted into another clause                                                  |
| Relative clause       | rel.cl       | clause | A clause that adds information about an element in the main clause                     |
| Dependent clause      | dep.cl       | clause | A clause that depends on another clause to form a complete sentence                    |
| Independent clause    | ind.cl       | clause | A clause that expresses a complete thought on its own                                  |

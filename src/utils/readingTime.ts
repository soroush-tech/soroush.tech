const WORDS_PER_MINUTE = 265

/** Estimated reading time in whole minutes for `wordCount` words (265 wpm, minimum 1). */
export const readingTime = (wordCount: number): number =>
  Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))

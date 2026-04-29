/**
 * Concatenates API fields back into verbatim copy when `. ` split was applied.
 */
export function fullTopicText(topic: {
  explanation: string;
  plainEnglishExplanation: string;
}): string {
  const { explanation, plainEnglishExplanation } = topic;
  if (!plainEnglishExplanation) return explanation;
  return `${plainEnglishExplanation} ${explanation}`;
}

/** Card teaser: first sentence when possible; visual ellipsis comes from CSS line-clamp. */
export function previewFromFullText(full: string): string {
  const trimmed = full.trim();
  const periodSpace = trimmed.indexOf(". ");
  if (periodSpace === -1) return trimmed;
  return trimmed.slice(0, periodSpace + 1);
}

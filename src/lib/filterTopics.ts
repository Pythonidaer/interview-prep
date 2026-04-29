import type { InterviewTopic } from "../graphql/topicsFromJson";
import { fullTopicText } from "./topicPreview";

/** Every non-empty token must appear (case-insensitive) in title, id, or full text. */
export function topicMatchesKeywords(
  topic: InterviewTopic,
  rawQuery: string,
): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${topic.title} ${topic.id} ${fullTopicText(topic)}`.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

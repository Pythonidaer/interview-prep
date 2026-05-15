import aiRoleRaw from "../../ai-role.json";

import type { InterviewTopic } from "./topicsFromJson";

type AiRoleEntry = {
  explanation: string;
  plainEnglishExplanation: string;
};

/** Human-readable title from snake_case id (underscores → words, capitalized words). */
function titleFromKey(id: string): string {
  return id
    .split("_")
    .map((segment) =>
      segment.length === 0 ? segment : segment[0]?.toUpperCase() + segment.slice(1),
    )
    .join(" ");
}

/** Sorted by display title for a stable grid order. */
export function getAiRoleTopics(): InterviewTopic[] {
  const topics: InterviewTopic[] = [];
  const data = aiRoleRaw as Record<string, AiRoleEntry>;

  for (const id of Object.keys(data)) {
    const entry = data[id];
    if (entry === undefined) continue;
    topics.push({
      id,
      title: titleFromKey(id),
      explanation: entry.explanation,
      plainEnglishExplanation: entry.plainEnglishExplanation,
    });
  }

  topics.sort((a, b) => a.title.localeCompare(b.title, "en"));
  return topics;
}

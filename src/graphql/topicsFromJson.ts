import interviewRaw from "../../interview.json";

export type InterviewTopic = {
  id: string;
  title: string;
  explanation: string;
  plainEnglishExplanation: string;
};

/** Shorter labels for specific topic ids (ids and JSON copy unchanged). */
const TITLE_DISPLAY_OVERRIDES: Partial<Record<string, string>> = {
  basic_core_coding_fundamentals: "Coding Fundamentals",
  continuous_integration_workflows: "Continuous Integration",
  javascript_data_structures_and_algorithms: "JavaScript DSA",
  strong_engineering_judgment: "Engineering Judgement",
};

/** Human-readable title from snake_case id (underscores → words, capitalized words). */
function titleFromKey(id: string): string {
  const display = TITLE_DISPLAY_OVERRIDES[id];
  if (display !== undefined) return display;
  return id
    .split("_")
    .map((segment) =>
      segment.length === 0 ? segment : segment[0]?.toUpperCase() + segment.slice(1),
    )
    .join(" ");
}

/**
 * Splits verbatim text at the first `. ` boundary when present so the opening
 * sentence can surface as Plain English while the remainder is the detailed
 * explanation. When no delimiter exists, the full string stays in explanation.
 */
function verbatimSplit(full: string): { detailed: string; plain: string } {
  const idx = full.indexOf(". ");
  if (idx === -1) {
    return { detailed: full, plain: "" };
  }
  return {
    plain: full.slice(0, idx + 1),
    detailed: full.slice(idx + 2),
  };
}

/** Sorted by display title for a stable grid order. */
export function getInterviewTopics(): InterviewTopic[] {
  const topics: InterviewTopic[] = [];

  const data = interviewRaw as Record<string, string>;
  for (const id of Object.keys(data)) {
    const verbatim = data[id];
    if (verbatim === undefined) continue;
    const { detailed, plain } = verbatimSplit(verbatim);
    topics.push({
      id,
      title: titleFromKey(id),
      explanation: detailed,
      plainEnglishExplanation: plain,
    });
  }

  topics.sort((a, b) => a.title.localeCompare(b.title, "en"));
  return topics;
}

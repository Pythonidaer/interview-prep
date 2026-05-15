import type { DocumentNode } from "graphql";
import { useId, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";

import { TopicModal } from "./TopicModal";
import type { InterviewTopic } from "../graphql/topicsFromJson";
import { topicMatchesKeywords } from "../lib/filterTopics";
import { fullTopicText, previewFromFullText } from "../lib/topicPreview";

import styles from "./TopicGlossaryPage.module.css";

import type { GlossaryTheme } from "../lib/glossaryTheme";

type TopicGlossaryPageProps = {
  query: DocumentNode;
  topicsField: "interviewTopics" | "aiRoleTopics";
  theme?: GlossaryTheme;
  lead: string;
  heading: string;
  subhead: string;
  gridAriaLabel: string;
  loadingText: string;
  errorText: string;
};

type TopicsQueryResult = {
  interviewTopics?: InterviewTopic[];
  aiRoleTopics?: InterviewTopic[];
};

function pageClass(theme: GlossaryTheme): string {
  return [styles.page, theme === "acelab" && styles.themeAcelab]
    .filter(Boolean)
    .join(" ");
}

export function TopicGlossaryPage({
  query,
  topicsField,
  theme = "default",
  lead,
  heading,
  subhead,
  gridAriaLabel,
  loadingText,
  errorText,
}: TopicGlossaryPageProps) {
  const { loading, error, data } = useQuery<TopicsQueryResult>(query);
  const [activeTopic, setActiveTopic] = useState<InterviewTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const openerElRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFieldId = useId();
  const searchLabelId = useId();

  const topics = data?.[topicsField] ?? EMPTY_TOPICS;
  const showClearSearch = searchQuery.length > 0;

  const filteredTopics = useMemo(
    () => topics.filter((t) => topicMatchesKeywords(t, searchQuery)),
    [topics, searchQuery],
  );

  const previews = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of topics) {
      const previewSource =
        t.plainEnglishExplanation.trim().length > 0
          ? t.plainEnglishExplanation
          : fullTopicText(t);
      map.set(t.id, previewFromFullText(previewSource));
    }
    return map;
  }, [topics]);

  const pageCls = pageClass(theme);

  if (loading) {
    return (
      <main className={pageCls}>
        <p className={styles.state} role="status">
          {loadingText}
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={pageCls}>
        <p className={`${styles.state} ${styles.stateError}`} role="alert">
          {errorText}
        </p>
      </main>
    );
  }

  return (
    <>
      <main className={pageCls}>
        <div className={styles.topBar}>
          <div className={styles.intro}>
            <p className={styles.lead}>{lead}</p>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.subhead}>{subhead}</p>
          </div>
          <div className={styles.searchWrap}>
            <label
              id={searchLabelId}
              className={styles.searchLabel}
              htmlFor={searchFieldId}
            >
              Filter topics by keyword
            </label>
            <div
              className={styles.searchAffix}
              role="search"
              aria-labelledby={searchLabelId}
            >
              <input
                ref={searchInputRef}
                id={searchFieldId}
                name="topic-search"
                className={`${styles.searchInput} ${showClearSearch ? styles.searchInputWithClear : ""}`}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                placeholder="Search topics…"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-controls="topic-grid"
              />
              {showClearSearch ? (
                <button
                  type="button"
                  className={styles.searchClear}
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    requestAnimationFrame(() => {
                      searchInputRef.current?.focus();
                    });
                  }}
                >
                  <span aria-hidden="true" className={styles.searchClearGlyph}>
                    ×
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <section
          id="topic-grid"
          aria-label={gridAriaLabel}
          className={styles.grid}
        >
          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={styles.card}
              title={topic.title}
              onClick={(e) => {
                openerElRef.current = e.currentTarget;
                setActiveTopic(topic);
              }}
            >
              <span className={styles.cardTitle}>{topic.title}</span>
              <span className={styles.cardPreview}>
                {previews.get(topic.id) ?? ""}
              </span>
            </button>
          ))}
        </section>
        {filteredTopics.length === 0 && (
          <p className={styles.emptyState} role="status">
            No topics match your search.
          </p>
        )}
      </main>
      <TopicModal
        topic={activeTopic}
        open={activeTopic !== null}
        onClose={() => setActiveTopic(null)}
        returnFocusTo={openerElRef.current}
        theme={theme}
      />
    </>
  );
}

const EMPTY_TOPICS: InterviewTopic[] = [];

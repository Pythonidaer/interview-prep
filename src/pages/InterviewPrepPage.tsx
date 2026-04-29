import { useId, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";

import { TopicModal } from "../components/TopicModal";
import { INTERVIEW_TOPICS_QUERY } from "../graphql/queries";
import type { InterviewTopic } from "../graphql/topicsFromJson";
import { topicMatchesKeywords } from "../lib/filterTopics";
import { fullTopicText, previewFromFullText } from "../lib/topicPreview";

import styles from "./InterviewPrepPage.module.css";

type TopicsQueryResult = {
  interviewTopics: InterviewTopic[];
};

export default function InterviewPrepPage() {
  const { loading, error, data } = useQuery<TopicsQueryResult>(
    INTERVIEW_TOPICS_QUERY,
  );
  const [activeTopic, setActiveTopic] = useState<InterviewTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const openerElRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFieldId = useId();
  const searchLabelId = useId();

  const topics = data?.interviewTopics ?? EMPTY_TOPICS;

  const showClearSearch = searchQuery.length > 0;

  const filteredTopics = useMemo(
    () => topics.filter((t) => topicMatchesKeywords(t, searchQuery)),
    [topics, searchQuery],
  );

  const previews = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of topics) {
      map.set(t.id, previewFromFullText(fullTopicText(t)));
    }
    return map;
  }, [topics]);

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.state} role="status">
          Loading topics…
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={`${styles.state} ${styles.stateError}`} role="alert">
          Unable to load interview topics. Try again shortly.
        </p>
      </main>
    );
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.topBar}>
          <div className={styles.intro}>
            <p className={styles.lead}>Interview preparation</p>
            <h1 className={styles.heading}>Topic glossary</h1>
            <p className={styles.subhead}>
              Topics from interview prep definitions. Choose a topic to read the
              full text in a modal.
            </p>
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
          aria-label="Interview topics"
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
      />
    </>
  );
}

const EMPTY_TOPICS: InterviewTopic[] = [];

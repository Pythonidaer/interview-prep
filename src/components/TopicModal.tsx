import { useCallback, useEffect, useId, useRef } from "react";

import type { InterviewTopic } from "../graphql/topicsFromJson";
import { fullTopicText } from "../lib/topicPreview";

import styles from "./TopicModal.module.css";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type TopicModalProps = {
  topic: InterviewTopic | null;
  open: boolean;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
};

export function TopicModal({
  topic,
  open,
  onClose,
  returnFocusTo,
}: TopicModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || topic === null) return;
    const id = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = [
        ...panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => !el.hasAttribute("hidden"));
      (focusables[0] ?? panel).focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, topic?.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) return;
    requestAnimationFrame(() => {
      returnFocusTo?.focus({ preventScroll: true });
    });
  }, [open, returnFocusTo]);

  if (!open || topic === null) return null;

  const hasPlain = topic.plainEnglishExplanation.length > 0;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className={styles.dialogWrap} role="presentation">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`${styles.panel} ${styles.panelEnter}`}
          tabIndex={-1}
        >
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {topic.title}
            </h2>
            <button
              type="button"
              className={styles.close}
              aria-label="Close"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          <div className={styles.body}>
            {hasPlain ? (
              <>
                <section
                  className={styles.section}
                  aria-label="Detailed explanation"
                >
                  <h3 className={styles.sectionLabel}>Detailed explanation</h3>
                  <p className={styles.sectionText}>{topic.explanation}</p>
                </section>
                <section
                  className={styles.section}
                  aria-label="Plain English"
                >
                  <h3 className={styles.sectionLabel}>Plain English</h3>
                  <p className={styles.sectionText}>
                    {topic.plainEnglishExplanation}
                  </p>
                </section>
              </>
            ) : (
              <section className={styles.section} aria-label="Explanation">
                <h3 className={styles.sectionLabel}>Explanation</h3>
                <p className={styles.sectionText}>{fullTopicText(topic)}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { TopicGlossaryPage } from "../components/TopicGlossaryPage";
import { INTERVIEW_TOPICS_QUERY } from "../graphql/queries";

export default function InterviewPrepPage() {
  return (
    <TopicGlossaryPage
      query={INTERVIEW_TOPICS_QUERY}
      topicsField="interviewTopics"
      lead="Interview preparation"
      heading="Topic glossary"
      subhead="Topics from interview prep definitions. Choose a topic to read the full text in a modal."
      gridAriaLabel="Interview topics"
      loadingText="Loading topics…"
      errorText="Unable to load interview topics. Try again shortly."
    />
  );
}

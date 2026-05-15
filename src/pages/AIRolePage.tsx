import { TopicGlossaryPage } from "../components/TopicGlossaryPage";
import { AI_ROLE_TOPICS_QUERY } from "../graphql/queries";

export default function AIRolePage() {
  return (
    <TopicGlossaryPage
      query={AI_ROLE_TOPICS_QUERY}
      topicsField="aiRoleTopics"
      theme="acelab"
      lead="AI role preparation"
      heading="Topic glossary"
      subhead="Topics for AI-focused product and platform work. Choose a topic to read the full explanation in a modal."
      gridAriaLabel="AI role topics"
      loadingText="Loading topics…"
      errorText="Unable to load AI role topics. Try again shortly."
    />
  );
}

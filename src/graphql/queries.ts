import { gql } from "@apollo/client";

export const INTERVIEW_TOPICS_QUERY = gql`
  query InterviewTopics {
    interviewTopics {
      id
      title
      explanation
      plainEnglishExplanation
    }
  }
`;

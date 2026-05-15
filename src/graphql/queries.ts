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

export const AI_ROLE_TOPICS_QUERY = gql`
  query AiRoleTopics {
    aiRoleTopics {
      id
      title
      explanation
      plainEnglishExplanation
    }
  }
`;

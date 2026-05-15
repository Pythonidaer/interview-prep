import { makeExecutableSchema } from "@graphql-tools/schema";

import { getAiRoleTopics } from "./aiRoleTopicsFromJson";
import type { InterviewTopic } from "./topicsFromJson";
import { getInterviewTopics } from "./topicsFromJson";

const typeDefs = /* GraphQL */ `
  type InterviewTopic {
    id: ID!
    title: String!
    explanation: String!
    plainEnglishExplanation: String!
  }

  type Query {
    interviewTopics: [InterviewTopic!]!
    aiRoleTopics: [InterviewTopic!]!
  }
`;

const interviewTopicsMemo: InterviewTopic[] = getInterviewTopics();
const aiRoleTopicsMemo: InterviewTopic[] = getAiRoleTopics();

const resolvers = {
  Query: {
    interviewTopics: (): InterviewTopic[] => interviewTopicsMemo,
    aiRoleTopics: (): InterviewTopic[] => aiRoleTopicsMemo,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

import { makeExecutableSchema } from "@graphql-tools/schema";

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
  }
`;

const interviewTopicsMemo: InterviewTopic[] = getInterviewTopics();

const resolvers = {
  Query: {
    interviewTopics: (): InterviewTopic[] => interviewTopicsMemo,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

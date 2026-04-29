import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";

import { schema } from "./schema";

/**
 * Runs GraphQL in-process against the executable schema backed by interview.json.
 */
export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema }),
});

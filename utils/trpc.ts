// Utility file
import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../pages/api/trpc/[trpc]";

// React query is the module that does querying on react
// TRPC is a *way* of querying, like rest, graphql, etc...
export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

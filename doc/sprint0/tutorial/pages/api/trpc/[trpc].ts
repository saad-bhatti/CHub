// We are putting our api under the url /api/trpc/:trpc i.e. /api/trpc/hello
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

export const appRouter = trpc
  .router()
  .query("hello", {
    // Creates a query
    input: z // input is a validator
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ ctx, input }) {
      // Function to be called
      return {
        greeting: `hello ${input?.text ?? "world"},, ${ctx}`,
      };
    },
  })
  .query("hi", {
    input: z.string(),
    resolve({ ctx, input }) {
      return "test";
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => "test", // This function takes the http information and returns the relavent i.e. gets user info from database from their token
});

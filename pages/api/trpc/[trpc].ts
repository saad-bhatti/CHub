// We are putting our api under the url /api/trpc/:trpc i.e. /api/trpc/hello
import * as trpcNext from "@trpc/server/adapters/next";
import { createContext, makeRouter } from "utils/routers/context";
import { UserRouter } from "utils/routers/UserRouter";
import { CourseRouter } from "utils/routers/CourseRouter";
import { AnnouncementRouter } from "utils/routers/AnnouncementRouter";
import { AssignmentRouter } from "utils/routers/AssignmentRouter";
import { PostRouter } from "utils/routers/PostRouter";
import { PostCommentRouter } from "utils/routers/PostCommentRouter";

export const appRouter = makeRouter()
  .merge("user.", UserRouter)
  .merge("course.", CourseRouter)
  .merge("announcement.", AnnouncementRouter)
  .merge("assignment.", AssignmentRouter)
  .merge("post.", PostRouter)
  .merge("postComment.", PostCommentRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext, // This function takes the http information and returns the relavent i.e. gets user info from database from their token
});

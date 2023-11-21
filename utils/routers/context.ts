import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import SurrealInterface from "../../database/surrealdb/interface/SurrealInterface";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { UserEnum } from "../types/User";
import superjson from "superjson";

// The app's context - is generated for each incoming request
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you'd might want to do in your ctx fn
  const session = await unstable_getServerSession(
    opts?.req,
    opts?.res,
    authOptions
  );
  return {
    user: session?.user,
    db: await SurrealInterface(),
  };
}

type AuthRequired = {
  auth: true;
  role?: z.infer<typeof UserEnum>;
};

export const TeacherRequired: AuthRequired = {
  auth: true,
  role: "Teacher",
};
export const AuthRequired: AuthRequired = {
  auth: true,
};

export const StudentRequired: AuthRequired = {
  auth: true,
  role: "Student",
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const makeRouter = () =>
  trpc
    .router<Context, AuthRequired>()
    .transformer(superjson)
    .middleware(({ ctx, meta, next }) => {
      if (!meta || !meta.auth) return next();
      if (ctx?.user && (!meta.role || meta.role == ctx.user.type)) {
        return next();
      }
      throw new TRPCError({ code: "UNAUTHORIZED", message: ctx.user? `This activity is only accessible to ${meta.role!}`: "Please log in to access this information" });
    });


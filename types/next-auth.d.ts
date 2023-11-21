import NextAuth, { DefaultSession } from "next-auth";
import { UserIdValidator, UserInputValidator } from "../utils/types/User";
import { JWT } from "next-auth/jwt";
import { z } from "zod";

type MyUser = z.infer<typeof UserInputValidator>;
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {} & MyUser;
  }
  interface User extends MyUser {
    email: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: z.infer<typeof UserIdValidator>;
  }
}

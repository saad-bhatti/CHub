import { compareSync } from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import SurrealInterface from "database/surrealdb/interface/SurrealInterface";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: "nala",
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        id: { label: "id", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!credentials) return null;

        const res = await (await SurrealInterface()).getUser(credentials.id);
        if (!res.success) throw new Error(res.error.message);
        const user = res.data;
        //todo: hashed password, cookie
        if (!user || !compareSync(credentials.password, user.password)) {
          return null;
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, user, token }) {
      const res = await (await SurrealInterface()).getUser(token.id);
      if (!res.success) throw new Error(res.error.message);
      session.user = res.data!;
      return session;
    },
  },
};

export default NextAuth(authOptions);

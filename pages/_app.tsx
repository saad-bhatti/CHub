// This overrides how nextjs default works
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "./api/trpc/[trpc]";
import { SessionProvider, useSession } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Session } from "next-auth";
import Loading from "../components/Loading";
import { UserEnum } from "../utils/types/User";
import { z } from "zod";
import { Page } from "../components/types";
import "./courses/[course]/posts/posts.css";
import superjson, { deserialize } from "superjson";
import { SuperJSONResult } from "superjson/dist/types";

type props = {
  session: Session;
} & {
  [key: string]: unknown;
};

const isSuperJson = (obj: any): obj is SuperJSONResult => {
  return "json" in obj;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: Page;
  pageProps: props;
}) => {
  return (
    <SessionProvider session={session}>
      {"auth" in Component ? (
        <Auth role={Component.role}>
          {(session) => (
            <Component
              {...{
                session,
                ...(isSuperJson(pageProps)
                  ? deserialize<any>(pageProps)
                  : pageProps),
              }}
            />
          )}
        </Auth>
      ) : (
        <Component
          {...(isSuperJson(pageProps)
            ? deserialize<any>(pageProps)
            : pageProps)}
        />
      )}
    </SessionProvider>
  );
};

function Auth({
  children,
  role,
}: {
  children: (session: Session) => JSX.Element;
  role?: z.infer<typeof UserEnum>;
}) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status, data } = useSession({ required: true });

  if (status === "loading" || !data) return <Loading />;

  if (role && data.user.type != role) return <Loading />; // TODO Add different pages for wrong accounts

  return children(data);
}

// This configures how trpc work i.e. the url for the api, etc...
export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);

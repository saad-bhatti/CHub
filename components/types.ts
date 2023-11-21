import { NextPage } from "next";
import { Session } from "next-auth";
import { z } from "zod";
import { UserEnum } from "../utils/types/User";

export type AuthedPage<P = {}> = NextPage<
  P & {
    session: Session;
  }
> & {
  auth: true;
  role?: z.infer<typeof UserEnum>;
};

export type Page<P = {}> = NextPage<P> | AuthedPage<P>;

import { AuthRequired, makeRouter, TeacherRequired } from "./context";
import { z } from "zod";
import {
  AnnouncementIDValidator,
  AnnouncementInputValidator,
  InputToAnnouncementValidator,
  AnnouncementMutableInputValidator,
} from "../types/Announcement";

export const AnnouncementRouter = makeRouter()
  .query("get", {
    meta: AuthRequired,
    input: AnnouncementIDValidator,
    output: z.nullable(AnnouncementInputValidator),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.getAnnouncement(input);
      if (!res.success) {
        console.error(res.error);
        return null;
      }
      return res.data;
    },
  })
  .mutation("add", {
    meta: TeacherRequired,
    input: InputToAnnouncementValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.addAnnouncement(input);
      if (!res.success) {
        console.error(res.error);
      }
      return res.success;
    },
  })
  .mutation("edit", {
    meta: TeacherRequired,
    input: z.object({
      id: AnnouncementIDValidator,
      newAnnouncement: AnnouncementMutableInputValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { id, newAnnouncement } }) => {
      const res = await db.editAnnouncement(id, newAnnouncement);
      if (!res.success) {
        console.error(res.error);
      }
      return res.success;
    },
  })
  .mutation("delete", {
    meta: TeacherRequired,
    input: AnnouncementIDValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.deleteAnnouncement(input);
      if (!res.success) {
        console.error(res.error);
      }
      return res.success;
    },
  });

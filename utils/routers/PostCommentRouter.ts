import { AuthRequired, makeRouter } from "./context";
import { z } from "zod";
import {
  PostCommentIdValidator,
  PostCommentInputValidator,
  InputToPostCommentValidator,
  PostCommentMutableInputValidator,
} from "../types/PostComment";

export const PostCommentRouter = makeRouter()
  // Get a comment for a post
  .query("get", {
    meta: AuthRequired,
    input: PostCommentIdValidator,
    output: z.nullable(PostCommentInputValidator),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.getComment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })
  // Create a comment for a post
  .mutation("add", {
    meta: AuthRequired,
    input: InputToPostCommentValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.addComment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Delete a comment for a post
  .mutation("delete", {
    meta: AuthRequired,
    input: PostCommentIdValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.deleteComment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Edit an existing comment for a post
  .mutation("edit", {
    meta: AuthRequired,
    input: z.object({
      id: PostCommentIdValidator,
      newPostComment: PostCommentMutableInputValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { id, newPostComment } }) => {
      const res = await db.editComment(id, newPostComment);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  });

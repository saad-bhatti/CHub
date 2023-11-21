import { AuthRequired, makeRouter } from "./context";
import { z } from "zod";
import {
  InputToPostValidator,
  PostIdValidator,
  PostInputValidator,
  PostMutableInputValidator,
} from "../types/Post";
import { PostCommentInputValidator } from "../types/PostComment";

export const PostRouter = makeRouter()
  // Get a post
  .query("get", {
    meta: AuthRequired,
    input: PostIdValidator,
    output: z.nullable(PostInputValidator),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.getPost(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })
  // Get all the comments for a post
  .query("comments", {
    meta: AuthRequired,
    input: PostIdValidator,
    output: z.nullable(PostCommentInputValidator.array()),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.getPostComments(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })
  // Create a post
  .mutation("add", {
    meta: AuthRequired,
    input: InputToPostValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.addPost(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Delete a post
  .mutation("delete", {
    meta: AuthRequired,
    input: PostIdValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const comments = await db.getPostComments(input);
      if (!comments.success) {
        console.log(comments.error);
        return false;
      }
      for (let comment of comments.data) {
        const s1 = await db.deleteComment(comment.id);
        if (!s1.success) {
          console.log(s1.error);
          return false;
        }
      }
      const res = await db.deletePost(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Edit an existing post
  .mutation("edit", {
    meta: AuthRequired,
    input: z.object({
      id: PostIdValidator,
      newPost: PostMutableInputValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { id, newPost } }) => {
      const res = await db.editPost(id, newPost);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Add or delete the user from the posts favorites set
  .mutation("favorite", {
    meta: AuthRequired,
    input: PostIdValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db, user }, input }) => {
      const post = await db.getPost(input);
      if (!post.success) {
        console.log(post.error);
        return false;
      }

      if (post.data == null) {
        return false;
      }

      // Check if the post contains the user already
      if (post.data.favorite.has(user!.id)) {
        post.data.favorite.delete(user!.id);
      } else {
        post.data.favorite.add(user!.id);
      }

      const res = await db.editPost(
        input,
        PostMutableInputValidator.parse(post.data)
      );
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
      }

      return res.success;
    },
  });

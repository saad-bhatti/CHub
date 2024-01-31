import { z } from "zod";
import { PostIdValidator, PostMutableInputValidator, PostValidator } from "../../utils/types/Post";
import { PostCommentValidator } from "../../utils/types/PostComment";
import { DatabaseResponseValidator, EmptyDatabaseResponseValidator } from "../types";

const addPost = z.function().args(PostValidator).returns(EmptyDatabaseResponseValidator);

const getPost = z
  .function()
  .args(PostIdValidator)
  .returns(DatabaseResponseValidator(PostValidator.nullable()));

const deletePost = z.function().args(PostIdValidator).returns(EmptyDatabaseResponseValidator);

const editPost = z
  .function()
  .args(PostIdValidator, PostMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

const getPostComments = z
  .function()
  .args(PostIdValidator)
  .returns(DatabaseResponseValidator(PostCommentValidator.array()));

export const PostDatabaseInterfaceMethods = {
  addPost,
  getPost,
  deletePost,
  editPost,
  getPostComments,
};

export const PostDatabaseInterface = z.object(PostDatabaseInterfaceMethods);
export type PostDatabaseInterface = z.infer<typeof PostDatabaseInterface>;

import { z } from "zod";
import {
  PostCommentIdValidator,
  PostCommentMutableInputValidator,
  PostCommentValidator,
} from "../../utils/types/PostComment";
import { DatabaseResponseValidator, EmptyDatabaseResponseValidator } from "../types";

const addComment = z.function().args(PostCommentValidator).returns(EmptyDatabaseResponseValidator);

const getComment = z
  .function()
  .args(PostCommentIdValidator)
  .returns(DatabaseResponseValidator(PostCommentValidator.nullable()));

const deleteComment = z
  .function()
  .args(PostCommentIdValidator)
  .returns(EmptyDatabaseResponseValidator);

const editComment = z
  .function()
  .args(PostCommentIdValidator, PostCommentMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

export const CommentDatabaseInterfaceMethods = {
  addComment,
  editComment,
  deleteComment,
  getComment,
};
export const CommentDatabaseInterface = z.object(CommentDatabaseInterfaceMethods);
export type CommentDatabaseInterface = z.infer<typeof CommentDatabaseInterface>;

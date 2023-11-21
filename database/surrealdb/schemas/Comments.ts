import { z } from "zod";
import { Post, PostIdValidator } from "../../../utils/types/Post";
import {
  PostComment,
  PostCommentContentValidator,
  PostCommentDateValidator,
  PostCommentEndorsementValidator,
  PostCommentIdValidator,
  PostCommentMutableInputValidator,
  PostCommentPermanentAttributes,
  PostCommentPinnedValidator,
  PostCommentResolvedValidator,
} from "../../../utils/types/PostComment";
import { UserIdValidator } from "../../../utils/types/User";
import {
  CommentTable,
  getRecord,
  PostTable,
  SurrealIdValidator,
  UserTable,
} from "../utils";

export const SurrealComment = z.object({
  id: SurrealIdValidator(CommentTable, PostCommentIdValidator),
  owner: SurrealIdValidator(UserTable, UserIdValidator),
  content: PostCommentContentValidator,
  date: PostCommentDateValidator,
  pinned: PostCommentPinnedValidator,
  resolved: PostCommentResolvedValidator,
  endorsed: PostCommentEndorsementValidator,
  postId: SurrealIdValidator(PostTable, PostIdValidator),
});

export const MutableSurrealComment = SurrealComment.omit({
  ...PostCommentPermanentAttributes,
  owner: PostCommentPermanentAttributes.ownerId,
});

export function CommentAsRecord(
  comment: PostComment
): z.infer<typeof SurrealComment> {
  return SurrealComment.parse({
    id: getRecord(CommentTable, comment.id),
    owner: getRecord(UserTable, comment.ownerId),
    date: comment.date,
    content: comment.content,
    pinned: comment.pinned,
    resolved: comment.resolved,
    postId: getRecord(PostTable, comment.postId),
    endorsed: comment.endorsement,
  });
}

export function MutableCommentAsRecord(
  comment: z.infer<typeof PostCommentMutableInputValidator>
): z.infer<typeof MutableSurrealComment> {
  return MutableSurrealComment.parse({
    pinned: comment.pinned,
    resolved: comment.resolved,
    endorsed: comment.endorsement,
    content: comment.content,
  });
}

export function RecordAsComment(
  record: z.infer<typeof SurrealComment>
): PostComment {
  return new PostComment({
    id: record.id.substr(CommentTable.length + 1),
    ownerId: record.owner.substr(UserTable.length + 1),
    date: record.date,
    content: record.content,
    endorsement: record.endorsed,
    pinned: record.pinned,
    postId: record.postId.substr(PostTable.length + 1),
    resolved: record.resolved,
  });
}

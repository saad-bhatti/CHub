import { z } from "zod";
import { UserIdValidator } from "./User";
import { PostIdValidator } from "./Post";
import { JSONDate } from "../constants";

// Validators for the different properties of a post comment
export const PostCommentIdValidator = z.string().min(8, "ID has to be at least 8 characters.");
export const PostCommentOwnerIdValidator = UserIdValidator;
export const PostCommentContentValidator = z.string().min(1, "Comment must have content");
export const PostCommentDateValidator = JSONDate;
export const PostCommentPinnedValidator = z.boolean();
export const PostCommentResolvedValidator = z.boolean();
export const PostCommentEndorsementValidator = z.boolean();
export const PostCommentPostIdValidator = PostIdValidator;

export const PostCommentPermanentAttributes: {
  id: true;
  ownerId: true;
  date: true;
  postId: true;
} = {
  id: true,
  ownerId: true,
  date: true,
  postId: true,
};

// Post comment object validator
export const PostCommentInputValidator = z.object({
  id: PostCommentIdValidator,
  ownerId: PostCommentOwnerIdValidator,
  content: PostCommentContentValidator,
  date: PostCommentDateValidator,
  pinned: PostCommentPinnedValidator,
  resolved: PostCommentResolvedValidator,
  endorsement: PostCommentEndorsementValidator,
  postId: PostCommentPostIdValidator,
});

export const PostCommentMutableInputValidator = PostCommentInputValidator.omit(
  PostCommentPermanentAttributes
);

// Post comment class that implements post comment type from validator
export class PostComment implements z.infer<typeof PostCommentInputValidator> {
  id: z.infer<typeof PostCommentIdValidator>;
  ownerId: z.infer<typeof PostCommentOwnerIdValidator>;
  content: z.infer<typeof PostCommentContentValidator>;
  date: z.infer<typeof PostCommentDateValidator>;
  pinned: z.infer<typeof PostCommentPinnedValidator>;
  resolved: z.infer<typeof PostCommentResolvedValidator>;
  endorsement: z.infer<typeof PostCommentEndorsementValidator>;
  postId: z.infer<typeof PostCommentPostIdValidator>;

  constructor(info: z.infer<typeof PostCommentInputValidator>) {
    ({
      id: this.id,
      ownerId: this.ownerId,
      content: this.content,
      date: this.date,
      pinned: this.pinned,
      resolved: this.resolved,
      endorsement: this.endorsement,
      postId: this.postId,
    } = PostCommentInputValidator.parse(info));
  }

  update(newInfo: z.infer<typeof PostCommentMutableInputValidator>) {
    ({
      content: this.content,
      pinned: this.pinned,
      resolved: this.resolved,
      endorsement: this.endorsement,
    } = PostCommentMutableInputValidator.parse(newInfo));
  }
}

export const PostCommentValidator = z.instanceof(PostComment);
export const InputToPostCommentValidator = PostCommentInputValidator.transform((postComment) => new PostComment(postComment));
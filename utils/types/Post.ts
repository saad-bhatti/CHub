import { z } from "zod";
import { JSONDate, JSONSet } from "../constants";
import { CourseCodeValidator } from "./Course";
import { UserIdValidator } from "./User";

// Validators for the different properties of the post
export const PostIdValidator = z.string().min(8, "Post ID has to be at least 8 characters long.");
export const PostCourseCodeValidator = CourseCodeValidator;
export const PostEndorsementValidator = z.boolean();
export const PostContentValidator = z.string().min(1, "Post must have content.");
export const PostTitleValidator = z.string().min(1, "Post must have title.");
export const PostDateValidator = JSONDate;
export const PostTypeValidator = z.enum(["Question", "Comment"]);
export const PostLikesValidator = z.number();
export const PostOwnerIdValidator = UserIdValidator;
export const PostPinnedValidator = z.boolean();
export const PostFavoriteValidator = JSONSet(UserIdValidator);

export const PostPermanentAttributes: {
  id: true;
  date: true;
  owner: true;
  course: true;
} = {
  id: true,
  date: true,
  owner: true,
  course: true,
};

// Post object validator
export const PostInputValidator = z.object({
  id: PostIdValidator,
  course: PostCourseCodeValidator,
  endorsement: PostEndorsementValidator,
  content: PostContentValidator,
  title: PostTitleValidator,
  date: PostDateValidator,
  type: PostTypeValidator,
  likes: PostLikesValidator,
  owner: PostOwnerIdValidator,
  pinned: PostPinnedValidator,
  favorite: PostFavoriteValidator,
});


export const PostMutableInputValidator = PostInputValidator.omit(
  PostPermanentAttributes
);

// Post class that implements post type from Validators
export class Post implements z.infer<typeof PostInputValidator> {
  id: z.infer<typeof PostIdValidator>;
  course: z.infer<typeof PostCourseCodeValidator>;
  endorsement: z.infer<typeof PostEndorsementValidator>;
  content: z.infer<typeof PostContentValidator>;
  title: z.infer<typeof PostTitleValidator>;
  date: z.infer<typeof PostDateValidator>;
  type: z.infer<typeof PostTypeValidator>;
  likes: z.infer<typeof PostLikesValidator>;
  owner: z.infer<typeof PostOwnerIdValidator>;
  pinned: z.infer<typeof PostPinnedValidator>;
  favorite: z.infer<typeof PostFavoriteValidator>;

  constructor(info: z.infer<typeof PostInputValidator>) {
    ({
      id: this.id,
      course: this.course,
      endorsement: this.endorsement,
      content: this.content,
      title: this.title,
      date: this.date,
      type: this.type,
      likes: this.likes,
      owner: this.owner,
      pinned: this.pinned,
      favorite: this.favorite,
    } = PostInputValidator.parse(info));
  }

  update(newInfo: z.infer<typeof PostMutableInputValidator>) {
    ({
      endorsement: this.endorsement,
      content: this.content,
      title: this.title,
      type: this.type,
      likes: this.likes,
      pinned: this.pinned,
      favorite: this.favorite,
    } = PostMutableInputValidator.parse(newInfo));
  }
}

export const PostValidator = z.instanceof(Post);
export const InputToPostValidator = PostInputValidator.transform((post) => new Post(post));
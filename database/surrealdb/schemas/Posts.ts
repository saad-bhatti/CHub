import { z } from "zod";
import { Course, CourseCodeValidator } from "../../../utils/types/Course";
import {
  Post,
  PostContentValidator,
  PostDateValidator,
  PostEndorsementValidator,
  PostIdValidator,
  PostLikesValidator,
  PostMutableInputValidator,
  PostPermanentAttributes,
  PostPinnedValidator,
  PostTitleValidator,
  PostTypeValidator,
  PostValidator,
} from "../../../utils/types/Post";
import { UserIdValidator } from "../../../utils/types/User";
import {
  CourseTable,
  getRecord,
  PostTable,
  SurrealIdValidator,
  UserTable,
} from "../utils";

const SurrealUserID = SurrealIdValidator(UserTable, UserIdValidator);
export const SurrealPost = z.object({
  id: SurrealIdValidator(PostTable, PostIdValidator),
  course: SurrealIdValidator(CourseTable, CourseCodeValidator),
  endorsed: PostEndorsementValidator,
  title: PostTitleValidator,
  content: PostContentValidator,
  date: PostDateValidator,
  type: PostTypeValidator,
  likes: PostLikesValidator,
  owner: SurrealIdValidator(UserTable, UserIdValidator),
  pinned: PostPinnedValidator,
  favorite: z.union([z.set(SurrealUserID), z.array(SurrealUserID)]).transform(s => s instanceof Set? Array.from(s) : s),
});

export const MutableSurrealPost = SurrealPost.omit(PostPermanentAttributes);

export function PostAsRecord(
  post: z.infer<typeof PostValidator>
): z.infer<typeof SurrealPost> {
  return SurrealPost.parse({
    id: getRecord(PostTable, post.id),
    course: getRecord(CourseTable, post.course),
    endorsed: post.endorsement,
    title: post.title,
    content: post.content,
    date: post.date,
    type: post.type,
    likes: post.likes,
    owner: getRecord(UserTable, post.owner),
    pinned: post.pinned,
    favorite: Array.from(post.favorite).map((id) => getRecord(UserTable, id)),
  });
}

export function MutablePostAsRecord(
  post: z.infer<typeof PostMutableInputValidator>
): z.infer<typeof MutableSurrealPost> {
  return MutableSurrealPost.parse({
    endorsed: post.endorsement,
    title: post.title,
    content: post.content,
    type: post.type,
    likes: post.likes,
    pinned: post.pinned,
    favorite: Array.from(post.favorite).map((id) => getRecord(UserTable, id)),
  });
}

export function RecordAsPost(record: z.infer<typeof SurrealPost>): Post {
  return new Post({
    id: record.id.substr(PostTable.length + 1),
    endorsement: record.endorsed,
    title: record.title,
    content: record.content,
    likes: record.likes,
    pinned: record.pinned,
    favorite: new Set(
      record.favorite.map((id) => id.substr(UserTable.length + 1))
    ),
    date: record.date,
    type: record.type,
    course: record.course.substr(CourseTable.length + 1),
    owner: record.owner.substr(UserTable.length + 1),
  });
}

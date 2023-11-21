import { z } from "zod";
import {
  CourseCodeValidator,
  CourseValidator,
} from "../../../utils/types/Course";
import {
  User,
  UserEmailValidator,
  UserEnum,
  UserIdValidator,
  UserMutableInputValidator,
  UsernameValidator,
  UserPermenantAttributes,
  UserVisible,
} from "../../../utils/types/User";
import {
  getRecord,
  UserTable,
  CourseTable,
  SurrealIdValidator,
} from "../utils";

export const SurrealUser = z.object({
  id: SurrealIdValidator(UserTable, UserIdValidator),
  username: UsernameValidator,
  email: UserEmailValidator,
  password: z.string(),
  type: UserEnum,
  enrolledCourses: SurrealIdValidator(CourseTable, CourseCodeValidator).array(),
  visible: UserVisible,
});
export const MutableSurrealUser = SurrealUser.omit(UserPermenantAttributes);

export function UserAsRecord(user: User): z.infer<typeof SurrealUser> {
  return {
    id: getRecord(UserTable, user.id),
    username: user.username,
    email: user.email,
    password: user.password,
    type: user.type,
    enrolledCourses: user.enrolledCourses.map((s) => getRecord(CourseTable, s)),
    visible: user.visible,
  };
}

export function MutableUserAsRecord(
  user: z.infer<typeof UserMutableInputValidator>
): z.infer<typeof MutableSurrealUser> {
  return {
    username: user.username,
    email: user.email,
    password: user.password,
    enrolledCourses: user.enrolledCourses.map((s) => getRecord(CourseTable, s)),
    visible: user.visible,
  };
}

export function RecordAsUser(obj: z.infer<typeof SurrealUser>): User {
  return new User({
    id: obj.id.substr(UserTable.length + 1),
    username: obj.username,
    email: obj.email,
    password: obj.password,
    type: obj.type,
    enrolledCourses: obj.enrolledCourses.map((str) =>
      str.substr(CourseTable.length + 1)
    ),
    visible: obj.visible,
  });
}

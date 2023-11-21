import { z, ZodLazy } from "zod";
import { CourseCodeValidator } from "./Course";

// Validators for the different properties of the user
export const UsernameValidator = z.string().min(5, "Your username must be at least 5 characters long.");
export const UserIdValidator = z.string().min(8, "Your user id must be at least 8 characters long.");
export const UserEmailValidator = z.string().email();
export const UserPasswordValidator = z.string().min(8, "Your password must be 8 characters long.").refine((s) => {const symbols = "!@#$%&*()"; return symbols.split("").some(v => s.includes(v))}, "Your password must contain one symbol.");
export const HashedPassword = z.string().min(1)
export const UserEnum = z.enum(["Student", "Teacher"]);
export const EnrolledCoursesValidator = z.array(z.string());
export const UserVisible = z.boolean();
export const UserPermenantAttributes: { id: true; type: true } = {
  id: true,
  type: true,
};

// User object validator
export const UserInputValidator = z.object({
  username: UsernameValidator,
  id: UserIdValidator,
  email: UserEmailValidator,
  password: UserPasswordValidator.or(HashedPassword),
  type: UserEnum,
  enrolledCourses: EnrolledCoursesValidator,
  visible: UserVisible,
});

export const UserMutableInputValidator = UserInputValidator.omit(
  UserPermenantAttributes
);

// User class that implements user type from validator
export class User implements z.infer<typeof UserInputValidator> {
  username: z.infer<typeof UsernameValidator>;
  id: z.infer<typeof UserIdValidator>;
  email: z.infer<typeof UserEmailValidator>;
  password: z.infer<typeof UserPasswordValidator>;
  type: z.infer<typeof UserEnum>;
  enrolledCourses: z.infer<typeof EnrolledCoursesValidator>;
  visible: z.infer<typeof UserVisible>;

  constructor(info: z.infer<typeof UserInputValidator>) {
    ({
      username: this.username,
      id: this.id,
      email: this.email,
      password: this.password,
      type: this.type,
      enrolledCourses: this.enrolledCourses,
      visible: this.visible,
    } = UserInputValidator.parse(info));
  }

  update(newInfo: z.infer<typeof UserMutableInputValidator>): void {
    ({
      username: this.username,
      password: this.password,
      email: this.email,
      enrolledCourses: this.enrolledCourses,
      visible: this.visible,
    } = UserMutableInputValidator.parse(newInfo));
  }
}

export const UserValidator = z.instanceof(User);
export const InputToUserValidator = UserInputValidator.transform((user) => new User(user));
export const StudentValidator = UserValidator.refine((user) => user.type === UserEnum.Values.Student, "User must be a student.");
export const TeacherValidator = UserValidator.refine((user) => user.type === UserEnum.Values.Teacher, "User must be a teacher");
type a = z.infer<typeof UserInputValidator>
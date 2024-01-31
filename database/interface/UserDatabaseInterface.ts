import { z } from "zod";
import { CourseCodeValidator, CourseValidator } from "../../utils/types/Course";
import { PostValidator } from "../../utils/types/Post";
import { UserIdValidator, UserMutableInputValidator, UserValidator } from "../../utils/types/User";
import { DatabaseResponseValidator, EmptyDatabaseResponseValidator } from "../types";

const addUser = z.function().args(UserValidator).returns(EmptyDatabaseResponseValidator);

const getUser = z
  .function()
  .args(UserIdValidator)
  .returns(DatabaseResponseValidator(UserValidator.nullable()));

const deleteUser = z.function().args(UserIdValidator).returns(EmptyDatabaseResponseValidator);

const editUser = z
  .function()
  .args(UserIdValidator, UserMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

const joinCourse = z
  .function()
  .args(UserIdValidator, CourseCodeValidator)
  .returns(EmptyDatabaseResponseValidator);

const getUserPosts = z
  .function()
  .args(UserIdValidator)
  .returns(DatabaseResponseValidator(PostValidator.array()));

const getCommentedPosts = z
  .function()
  .args(UserIdValidator)
  .returns(DatabaseResponseValidator(PostValidator.array()));

const getUserCourses = z
  .function()
  .args(UserIdValidator)
  .returns(DatabaseResponseValidator(CourseValidator.array()));

export const UserDatabaseInterfaceMethods = {
  getUser,
  addUser,
  deleteUser,
  editUser,
  joinCourse,
  getUserPosts,
  getCommentedPosts,
  getUserCourses,
};

export const UserDatabaseInterface = z.object(UserDatabaseInterfaceMethods);
export type UserDatabaseInterface = z.infer<typeof UserDatabaseInterface>;

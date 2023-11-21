import { z } from "zod";
import {
  UserIdValidator,
  UserValidator,
  UserMutableInputValidator,
} from "../../utils/types/User";
import {
  DatabaseResponseValidator,
  EmptyDatabaseResponseValidator,
} from "../types";
//import database from "../FakeDatabase";
import { CourseCodeValidator, CourseValidator } from "../../utils/types/Course";
import { PostValidator } from "../../utils/types/Post";

const addUser = z
  .function()
  .args(UserValidator)
  .returns(EmptyDatabaseResponseValidator);

const getUser = z
  .function()
  .args(UserIdValidator)
  .returns(DatabaseResponseValidator(UserValidator.nullable()));

const deleteUser = z
  .function()
  .args(UserIdValidator)
  .returns(EmptyDatabaseResponseValidator);

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
}

export const UserDatabaseInterface = z.object(UserDatabaseInterfaceMethods);
export type UserDatabaseInterface = z.infer<typeof UserDatabaseInterface>;

// export const FakeUserDatabaseAccessor: z.infer<typeof UserDatabaseInterface> = {
//   // Queries
//   getUser: getUser.implement(async (id) => {
//     return Promise.resolve({
//       success: true,
//       data: database.users.filter((u) => u.id === id).at(0) || null,
//     });
//   }),

//   // Mutations
//   addUser: addUser.implement(async (user) => {
//     database.users.push(user);
//     return Promise.resolve({ success: true });
//   }),
//   deleteUser: deleteUser.implement(async (userId) => {
//     database.users = database.users.filter((user) => user.id !== userId);
//     return Promise.resolve({ success: true });
//   }),
//   editUser: editUser.implement(async (userId, user) => {
//     database.users = database.users.map((databaseUser) => {
//       if (databaseUser.id === userId) databaseUser.update(user);
//       return databaseUser;
//     });
//     return Promise.resolve({ success: true });
//   }),
//   joinCourse: joinCourse.implement(async (userid, coursecode) => {
//     // Add the course code to the user's enrolled courses
//     const user = database.users.filter((u) => u.id === userid).at(0);
//     const course = database.courses
//       .filter((c) => c.courseCode === coursecode)
//       .at(0);
//     if (!user)
//       return {
//         success: false,
//         error: { error: "DatabaseError", message: "User does not exist" },
//       };
//     if (!course)
//       return {
//         success: false,
//         error: { error: "DatabaseError", message: "Course does not exist" },
//       };
//     user.enrolledCourses.push(coursecode);
//     // Add the user's instance to the course's people or instructors
//     if (user.type === "Student") course.people.push(user.id); // Student
//     else course.instructors.push(user.id); // Instructor
//     database.users = database.users.map((databaseUser) => {
//       if (databaseUser.id === user.id) databaseUser.update(user);
//       return databaseUser;
//     });
//     database.courses = database.courses.map((databaseCourse) => {
//       if (databaseCourse.courseCode === course.courseCode)
//         databaseCourse.update(course);
//       return databaseCourse;
//     });
//     return Promise.resolve({ success: true });
//   }),
// };

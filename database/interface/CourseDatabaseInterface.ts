import { z } from "zod";
import {
  CourseCodeValidator,
  CourseMutableInputValidator,
  CourseValidator,
} from "../../utils/types/Course";
import { AnnouncementValidator } from "../../utils/types/Announcement";
import {
  DatabaseResponseValidator,
  EmptyDatabaseResponseValidator,
} from "../types";
//import database from "../FakeDatabase";
import {
  UserEnum,
  UserIdValidator,
  UserValidator,
} from "../../utils/types/User";
import { Assignment, AssignmentValidator } from "../../utils/types/Assignment";
import { PostValidator } from "../../utils/types/Post";

/********* COURSE-RELATED DATABASE DECLARATIONS *********/
const getCourse = z
  .function()
  .args(CourseCodeValidator)
  .returns(DatabaseResponseValidator(CourseValidator.nullable()));

const addCourse = z
  .function()
  .args(CourseValidator)
  .returns(EmptyDatabaseResponseValidator);

const deleteCourse = z
  .function()
  .args(CourseCodeValidator)
  .returns(EmptyDatabaseResponseValidator);

const editCourse = z
  .function()
  .args(CourseCodeValidator, CourseMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

const getCourseAnnouncements = z
  .function()
  .args(CourseCodeValidator)
  .returns(DatabaseResponseValidator(AnnouncementValidator.array()));

const getCourseUsers = z
  .function()
  .args(CourseCodeValidator)
  .returns(DatabaseResponseValidator(UserValidator.array().nullable()));

const getCourseAssignments = z
  .function()
  .args(CourseCodeValidator)
  .returns(DatabaseResponseValidator(AssignmentValidator.array()));

const getCoursePosts = z
  .function()
  .args(CourseCodeValidator)
  .returns(DatabaseResponseValidator(PostValidator.array()));

const enrollUser = z
  .function()
  .args(UserIdValidator, CourseCodeValidator, UserEnum.optional())
  .returns(EmptyDatabaseResponseValidator);

const unenrollUser = z
  .function()
  .args(UserIdValidator, CourseCodeValidator, UserEnum.optional())
  .returns(EmptyDatabaseResponseValidator);

export const CourseDatabaseInterfaceMethods = {
  getCourse,
  getCourseAnnouncements,
  addCourse,
  deleteCourse,
  editCourse,
  getCourseUsers,
  getCourseAssignments,
  getCoursePosts,
  enrollUser,
  unenrollUser,
};
export const CourseDatabaseInterface = z.object(CourseDatabaseInterfaceMethods);
export type CourseDatabaseInterface = z.infer<typeof CourseDatabaseInterface>;
// export const FakeCourseDatabaseAccessor = {
//   getCourse: getCourse.implement(async (code) => {
//     return Promise.resolve({
//       success: true,
//       data: database.courses.filter((c) => c.courseCode === code).at(0) || null,
//     });
//   }),
//   getAnnouncements: getCourseAnnouncements.implement(async (code) => {
//     return Promise.resolve({
//       success: true,
//       data: database.announcements.filter(
//         (announcement) => announcement.courseCode === code
//       ),
//     });
//   }),
//   // Mutations
//   addCourse: addCourse.implement((course) => {
//     database.courses.push(course);
//     return Promise.resolve({ success: true });
//   }),
//   deleteCourse: deleteCourse.implement((code) => {
//     database.courses = database.courses.filter((c) => c.courseCode !== code);
//     return Promise.resolve({ success: true });
//   }),
//   editCourse: editCourse.implement((code, course) => {
//     database.courses = database.courses.map((databaseCourse) => {
//       if (databaseCourse.courseCode === code) databaseCourse.update(course);
//       return databaseCourse;
//     });
//     return Promise.resolve({ success: true });
//   }),
//   getCourseUsers: getCourseUsers.implement(async (code) => {
//     const foundCourse =
//       database.courses.filter((c) => c.courseCode === code).at(0) || null;
//     return Promise.resolve({
//       success: true,
//       data: foundCourse
//         ? foundCourse.people.map(
//             (id) => database.users.filter((u) => u.id === id)[0]
//           )
//         : null,
//     });
//   }),
//   getCourseAssignments: getCourseAssignments.implement(async (courseCode) => {
//     return Promise.resolve({
//       success: true,
//       data: database.assignments.filter(
//         (assg) => assg.courseCode === courseCode
//       ),
//     });
//   }),
// };

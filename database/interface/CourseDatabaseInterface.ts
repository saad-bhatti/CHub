import { z } from "zod";
import { AnnouncementValidator } from "../../utils/types/Announcement";
import { AssignmentValidator } from "../../utils/types/Assignment";
import {
  CourseCodeValidator,
  CourseMutableInputValidator,
  CourseValidator,
} from "../../utils/types/Course";
import { PostValidator } from "../../utils/types/Post";
import { UserEnum, UserIdValidator, UserValidator } from "../../utils/types/User";
import { DatabaseResponseValidator, EmptyDatabaseResponseValidator } from "../types";

/********* COURSE-RELATED DATABASE DECLARATIONS *********/
const getCourse = z
  .function()
  .args(CourseCodeValidator)
  .returns(DatabaseResponseValidator(CourseValidator.nullable()));

const addCourse = z.function().args(CourseValidator).returns(EmptyDatabaseResponseValidator);

const deleteCourse = z.function().args(CourseCodeValidator).returns(EmptyDatabaseResponseValidator);

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

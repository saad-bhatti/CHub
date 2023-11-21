import { AuthRequired, makeRouter, TeacherRequired } from "./context";
import { z } from "zod";
import {
  CourseCodeValidator,
  CourseInputValidator,
  InputToCourseValidator,
  CourseMutableInputValidator,
} from "../types/Course";
import { AnnouncementInputValidator } from "../types/Announcement";
import { AssignmentInputValidator } from "../types/Assignment";
import { Post, PostInputValidator } from "../types/Post";
import { UserInputValidator } from "../types/User";

export const CourseRouter = makeRouter()
  /** COURSE-INSTANCE RELATED **/
  // Get a course by its code and semester
  .query("get", {
    meta: AuthRequired,
    input: CourseCodeValidator,
    output: z.nullable(CourseInputValidator),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.getCourse(input);
      if (!res.success) {
        console.log(res.error);
        return null;
      }
      return res.data;
    },
  })
  // Add a course to the database
  .mutation("add", {
    meta: TeacherRequired,
    input: InputToCourseValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.addCourse(input);
      if (!res.success) {
        console.error(res.error);
      }
      return res.success;
    },
  })
  // Delete a course from the database
  .mutation("delete", {
    meta: TeacherRequired,
    input: CourseCodeValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const courseobj = await db.getCourse(input);
      if (!courseobj.success) {
        console.log(courseobj.error);
        return false;
      } else if (!courseobj.data) {
        console.log("Course does not exist");
        return false;
      }
      for (let people of courseobj.data.people) {
        const s1 = await db.unenrollUser(
          people,
          courseobj.data.courseCode,
          undefined
        );
        if (!s1.success) {
          console.log(s1.error);
          return false;
        }
      }
      for (let people of courseobj.data.instructors) {
        const s2 = await db.unenrollUser(
          people,
          courseobj.data.courseCode,
          undefined
        );
        if (!s2.success) {
          console.log(s2.error);
          return false;
        }
      }
      const posts = await db.getCoursePosts(courseobj.data.courseCode);
      if (!posts.success) {
        console.log(posts.error);
        return false;
      }
      for (let post of posts.data) {
        const s3 = await db.deletePost(post.id);
        if (!s3.success) {
          console.log(s3.error);
          return false;
        }
      }
      const announcements = await db.getCourseAnnouncements(
        courseobj.data.courseCode
      );
      if (!announcements.success) {
        console.log(announcements.error);
        return false;
      }
      for (let announcement of announcements.data) {
        const s4 = await db.deleteAnnouncement(announcement.announcementID);
        if (!s4.success) {
          console.log(s4.error);
          return false;
        }
      }
      const assignments = await db.getCourseAssignments(
        courseobj.data.courseCode
      );
      if (!assignments.success) {
        console.log(assignments.error);
        return false;
      }
      for (let assignment of assignments.data) {
        const s5 = await db.deleteAssignment(assignment.id);
        if (!s5.success) {
          console.log(s5.error);
          return false;
        }
      }
      const res = await db.deleteCourse(input);
      if (!res.success) {
        console.error(res.error);
      }
      return res.success;
    },
  })
  // Update a course that exists in the database
  .mutation("update", {
    meta: TeacherRequired,
    input: z.object({
      code: CourseCodeValidator,
      newCourse: CourseMutableInputValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { code, newCourse } }) => {
      const res = await db.editCourse(code, newCourse);
      if (!res.success) {
        console.error(res.error);
      }
      return res.success;
    },
  })
  // Generate a join link for a course
  .query("genLink", {
    meta: TeacherRequired,
    input: CourseCodeValidator,
    output: z.nullable(z.string()),
    resolve: async ({ ctx: { db, user }, input }) => {
      // Get the course specified from the database
      const res = await db.getCourse(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (res.data === null) {
        console.log(`Error: Course ${input} not found`);
        return null;
      }

      // Check the user is an instructor of the course
      if (!res.data.instructors.includes(user!.id)) {
        console.log("UNAUTHORIZED");
        return null;
      }

      // Otherwise, generate the link
      return "chub.com/api/join/" + encodeURIComponent(res.data.courseCode);
    },
  })

  /** ALL INSTANCES WITHIN A COURSE RELATED **/
  .query("announcements", {
    meta: AuthRequired,
    input: CourseCodeValidator,
    output: z.nullable(AnnouncementInputValidator.array()),
    resolve: async ({ ctx: { db }, input }) => {
      const course = await db.getCourse(input);
      if (!course.success || !course.data) {
        return null;
      }
      const res = await db.getCourseAnnouncements(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })
  // Get all the assignments for a specified course
  .query("assignments", {
    meta: AuthRequired,
    input: CourseCodeValidator,
    output: z.nullable(AssignmentInputValidator.array()),
    resolve: async ({ ctx: { db }, input }) => {
      const course = await db.getCourse(input);
      if (!course.success || !course.data) {
        return null;
      }
      const res = await db.getCourseAssignments(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })
  // Get all the posts in the specified course
  .query("posts", {
    meta: AuthRequired,
    input: CourseCodeValidator,
    output: z.nullable(PostInputValidator.array()),
    resolve: async ({ ctx: { db }, input }) => {
      const course = await db.getCourse(input);
      if (!course.success || !course.data) {
        return null;
      }
      const res = await db.getCoursePosts(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })
  // Get all students in the specified course
  .query("users", {
    meta: AuthRequired,
    input: CourseCodeValidator,
    output: z.nullable(UserInputValidator.array()),
    resolve: async ({ ctx: { db }, input }) => {
      const course = await db.getCourse(input);
      if (!course.success || !course.data) {
        return null;
      }
      const res = await db.getCourseUsers(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })

  /** COURSE-MATERIAL RELATED **/
  // Get all the filenames of the files of the course
  .query("filenames", {
    meta: AuthRequired,
    input: CourseCodeValidator,
    output: z.nullable(z.string().array()),
    resolve: async ({ ctx: { db }, input }) => {
      // Get the course instance
      const res = await db.getCourse(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (!res.data) {
        console.log("The course with code '" + input + "' does not exist");
        return null;
      }
      // Return all the filenames of the course's material
      return res.data.getFileNames();
    },
  })
  // Get the content of a specified file of the course
  .query("fileContent", {
    meta: AuthRequired,
    input: z.object({
      code: CourseCodeValidator,
      fileName: z.string(),
    }),
    output: z.nullable(z.string()),
    resolve: async ({ ctx: { db }, input: { code, fileName } }) => {
      // Get the course instance
      const res = await db.getCourse(code);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (!res.data) {
        console.log("The course with code '" + code + "' does not exist");
        return null;
      }
      // Retrieve the content of the file
      return res.data.readCourseFile(fileName);
    },
  })
  // Add a file to the course's material
  .mutation("uploadFile", {
    meta: TeacherRequired,
    input: z.object({
      code: CourseCodeValidator,
      fileName: z.string(),
      fileContent: z.string(),
    }),
    output: z.boolean(),
    resolve: async ({
      ctx: { db },
      input: { code, fileName, fileContent },
    }) => {
      // Get the course instance
      const res = await db.getCourse(code);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return false;
      }
      if (!res.data) {
        console.log("The course with code '" + code + "' does not exist");
        return false;
      }
      // Save the file to its proper locations
      res.data.createCourseFile(fileName, fileContent);
      return true;
    },
  })
  // Delete a file from the course's material
  .mutation("delFile", {
    meta: TeacherRequired,
    input: z.object({
      code: CourseCodeValidator,
      fileName: z.string(),
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { code, fileName } }) => {
      // Get the course instance
      const res = await db.getCourse(code);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return false;
      }
      if (!res.data) {
        console.log("The course with code '" + code + "' does not exist");
        return false;
      }
      // Delete the file
      res.data.deleteCourseFile(fileName);
      return true;
    },
  });

import { hashSync } from "bcryptjs";
import { z } from "zod";
import { AssignmentIDValidator, GradeValidator } from "../types/Assignment";
import { CourseCodeValidator, CourseValidator } from "../types/Course";
import { PostInputValidator } from "../types/Post";
import {
  InputToUserValidator,
  UserEnum, UserIdValidator,
  UserInputValidator,
  UserMutableInputValidator
} from "../types/User";
import { AuthRequired, makeRouter } from "./context";

export const UserRouter = makeRouter()
  // Get a user by their id
  .query("get", {
    input: UserIdValidator.optional(),
    output: z.nullable(UserInputValidator),
    resolve: async ({ ctx: { db, user }, input }) => {
      const res = await db.getUser(input || user!.id);
      if (!res.success) {
        console.log(res.error);
        return null;
      }
      return res.data;
    },
  })
  // Add a user to the database
  .mutation("add", {
    input: InputToUserValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      input.password = hashSync(input.password, 10);
      const res = await db.addUser(input);
      if (!res.success) {
        console.log(res.error);
      }
      return res.success;
    },
  })
  // Delete a user from the database
  .mutation("delete", {
    meta: AuthRequired,
    input: UserIdValidator.optional(),
    output: z.boolean(),
    resolve: async ({ ctx: { db, user }, input }) => {
      input = input || user!.id;
      const userobj = await db.getUser(input);
      if (!userobj.success) {
        console.log(userobj.error);
        return false;
      }
      if (!userobj.data) {
        console.log("User not found:" + input);
        return false;
      }
      /* delete posts and their comments */
      const posts = await db.getUserPosts(input);
      if (!posts.success) {
        console.log(posts.error);
        return false;
      }
      for (let post of posts.data) {
        const comments = await db.getPostComments(post.id);
        if (!comments.success) {
          console.log(comments.error);
          return false;
        }
        for (let comment of comments.data) {
          const s1 = await db.deleteComment(comment.id);
          if (!s1.success) {
            console.log(s1.error);
            return false;
          }
        }
        const s2 = await db.deletePost(post.id);
        if (!s2.success) {
          console.log(s2.error);
          return false;
        }
      }
      for (let course of userobj.data.enrolledCourses) {
        const courseobj = await db.getCourse(course);
        if (!courseobj.success) {
          console.log(courseobj.error);
          return false;
        }
        if (!courseobj.data) {
          console.log("Course not found:" + course);
          return false;
        }

        /*Unenroll user */
        const s3 = await db.unenrollUser(
          userobj.data.id,
          courseobj.data.courseCode,
          userobj.data.type
        );
        if (!s3.success) {
          console.log(s3.error);
          return false;
        }

        /* Remove assignment contribution */
        const assignments = await db.getCourseAssignments(
          courseobj.data.courseCode
        );
        if (!assignments.success) {
          console.log(assignments.error);
          return false;
        }
        for (let assignment of assignments.data) {
          if (assignment.files.has(userobj.data.id)) {
            assignment.files.delete(userobj.data.id);
          }
          if (Object.keys(assignment.grades).indexOf(userobj.data.id) != -1) {
            delete assignment.grades[userobj.data.id];
          }
          if (Object.keys(assignment.comments).indexOf(userobj.data.id) != -1) {
            delete assignment.comments[userobj.data.id];
          }
          const s4 = await db.editAssignment(assignment.id, assignment);
          if (!s4.success) {
            console.log(s4.error);
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
          if (announcement.instructor === userobj.data.id) {
            const s5 = await db.deleteAnnouncement(announcement.announcementID);
            if (!s5.success) {
              console.log(s5.error);
              return false;
            }
          }
        }
      }

      const s6 = await db.deleteUser(input || user!.id);
      if (!s6.success) {
        console.log(s6.error);
        return s6.success;
      }
      return true;
    },
  })
  // Update a user that exists in the database
  .mutation("update", {
    meta: AuthRequired,
    input: z.object({
      id: UserIdValidator.optional(),
      newUser: UserMutableInputValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db, user }, input: { id, newUser } }) => {
      if (id) {
        const u = await db.getUser(id);
        if (!u.success || !u.data) return false;
        user = u.data;
      }
      if (user!.password !== newUser.password) {
        newUser.password = hashSync(newUser.password, 10);
      }
      const res = await db.editUser(id || user!.id, newUser);
      if (!res.success) {
        console.log(res.error);
      }
      return res.success;
    },
  })
  // Add the user to the specified course
  .mutation("joinCourse", {
    meta: AuthRequired,
    input: z.object({
      courseCode: CourseCodeValidator,
      user: UserIdValidator.optional(),
      type: UserEnum.optional(),
    }),
    output: z.boolean(),
    resolve: async ({
      ctx: { db, user },
      input: { courseCode, user: id, type },
    }) => {
      let res = await db.joinCourse(id || user!.id, courseCode);
      if (!res.success) {
        console.log(res.error);
        return res.success;
      }
      res = await db.enrollUser(
        id || user!.id,
        courseCode,
        id ? type : user!.type
      );
      return res.success;
    },
  })
  // Get all the posts made by the user
  .query("posts", {
    meta: AuthRequired,
    input: UserIdValidator.optional(),
    output: z.nullable(PostInputValidator.array()),
    resolve: async ({ ctx: { db, user }, input }) => {
      const res = await db.getUserPosts(input || user!.id);
      if (!res.success) {
        console.log(res.error);
        return null;
      }
      return res.data;
    },
  })
  .query("courses", {
    meta: AuthRequired,
    input: UserIdValidator.optional(),
    output: CourseValidator.array(),
    resolve: async ({ ctx: { db, user }, input }) => {
      const res = await db.getUserCourses(input || user!.id);
      if (!res.success) {
        console.log(res.error);
        return [];
      }
      return res.data;
    },
  })
  // Get all the student's assignment grades for a specified course
  .query("courseAssignmentGrades", {
    meta: AuthRequired,
    input: z.object({
      userId: UserIdValidator.optional(),
      courseCode: CourseCodeValidator,
    }),
    output: z
      .record(AssignmentIDValidator, GradeValidator.nullable())
      .nullable(),
    resolve: async ({ ctx: { db, user }, input: { userId, courseCode } }) => {
      let studentId = userId || user!.id;
      // Get all assignments of the specified course
      const assgRes = await db.getCourseAssignments(courseCode);
      if (!assgRes.success) {
        console.log(
          "Error: " +
            assgRes.error.error +
            "\nMessage: " +
            assgRes.error.message
        );
        return null;
      }

      let assgToGrade: { [key: string]: any } = {};
      // Traverse the assignments and get the students grade for the assignment
      assgRes.data.forEach((assg) => {
        // Check if the user has a grade for their submission
        const exists = Object.keys(assg.grades).find((id) => id === studentId);
        // No grade exists, so set value to null
        if (!exists) assgToGrade[assg.id] = null;
        // Set the value to the grade
        else assgToGrade[assg.id] = assg.grades[studentId];
      });

      // Return the list with key=assignmentId: value=grade/null (if grade exists or not)
      return assgToGrade;
    },
  });

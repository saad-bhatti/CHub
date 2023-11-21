import { AuthRequired, makeRouter, TeacherRequired } from "./context";
import { z } from "zod";
import { UserIdValidator } from "../types/User";
import {
  AssignmentIDValidator,
  AssignmentInputValidator,
  InputToAssignmentValidator,
  AssignmentMutableInputValidator,
  CommentValidator,
  GradeValidator,
} from "../types/Assignment";

export const AssignmentRouter = makeRouter()
  /* ASSIGNMENT INSTANCE RELATED */
  // Get an assignment specified by its id
  .query("get", {
    meta: AuthRequired,
    input: AssignmentIDValidator,
    output: z.nullable(AssignmentInputValidator),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.getAssignment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      return res.data;
    },
  })

  // Create and add an assignment to the database
  .mutation("add", {
    meta: TeacherRequired,
    input: InputToAssignmentValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.addAssignment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Delete an assignment from the database
  .mutation("delete", {
    meta: TeacherRequired,
    input: AssignmentIDValidator,
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input }) => {
      const res = await db.deleteAssignment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })
  // Edit an assignment that exists in the database
  .mutation("edit", {
    meta: TeacherRequired,
    input: z.object({
      id: AssignmentIDValidator,
      newAssg: AssignmentMutableInputValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { id, newAssg } }) => {
      const res = await db.editAssignment(id, newAssg);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return res.success;
      }
      return res.success;
    },
  })

  /* ASSIGNMENT UPLOAD RELATED */
  // Get a student's submitted assignment file's content from the assignment uploads folder
  .query("content", {
    meta: AuthRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
    }),
    output: z.nullable(z.string()),
    resolve: async ({ ctx: { db }, input: { assgId, studentId } }) => {
      // Retrieve the assignment instance from the database
      const res = await db.getAssignment(assgId);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (res.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return null;
      }

      // Check if the user submitted an assignment
      if (!res.data.checkAssignmentFileExists(studentId)) {
        console.log(
          `Error: user ${studentId} submission for assignment ${assgId} not found`
        );
        return null;
      }
      return res.data.readFile(studentId);
    },
  })
  // Add a file to the assignment uploads folder
  .mutation("upload", {
    meta: AuthRequired,
    input: z.object({
      ID: AssignmentIDValidator,
      content: z.string(),
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db, user }, input: { ID, content } }) => {
      // Retrieve the assignment instance from the database
      const resOne = await db.getAssignment(ID);
      if (!resOne.success) {
        console.log(
          "Error: " + resOne.error.error + "\nMessage: " + resOne.error.message
        );
        return resOne.success;
      }
      if (resOne.data === null) {
        console.log(`Error: Assignment ${ID} not found`);
        return false;
      }
      if (resOne.data.dueDate < new Date()) {
        console.log("After assignment date.");
        return false;
      }
      // Save the content of the submission in a file and update the instance in database
      resOne.data.writeFile(user!.id, content);
      delete resOne.data.grades[user!.id];
      delete resOne.data.comments[user!.id];
      const resTwo = await db.editAssignment(resOne.data.id, resOne.data);
      if (!resTwo.success) {
        console.log(
          "Error: " + resTwo.error.error + "\nMessage: " + resTwo.error.message
        );
        return resTwo.success;
      }
      return resTwo.success;
    },
  })

  /* ASSIGNMENT GRADE RELATED */
  .query("average", {
    meta: AuthRequired,
    input: AssignmentIDValidator,
    output: z.nullable(GradeValidator),
    resolve: async ({ ctx: { db }, input }) => {
      // Retrieve the assignment instance from the database
      const res = await db.getAssignment(input);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (res.data === null) {
        console.log(`Error: Assignment ${input} not found`);
        return null;
      }

      // Calculate the average of the grades
      const vals = Object.values(res.data.grades);
      if (!vals.length) return 0;
      return vals.reduce((partialSum, a) => partialSum + a, 0) / vals.length;
    },
  })
  // Get a student's grade for a specified assignment
  .query("grade", {
    meta: AuthRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
    }),
    output: z.nullable(GradeValidator),
    resolve: async ({ ctx: { db }, input: { assgId, studentId } }) => {
      // Retrieve the assignment instance from the database
      const res = await db.getAssignment(assgId);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (res.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return null;
      }

      // Check if the user has a grade for their submission
      const exists = Object.keys(res.data.grades).find(
        (id) => id === studentId
      );
      if (!exists) {
        console.log(
          `Error: user ${studentId} grade for assignment ${assgId} not found`
        );
        return null;
      }
      return res.data.grades[studentId];
    },
  })
  // Add a grade for a student's assignment submission
  .mutation("addGrade", {
    meta: TeacherRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
      grade: GradeValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { assgId, studentId, grade } }) => {
      // Retrieve the assignment instance from the database
      const resOne = await db.getAssignment(assgId);
      if (!resOne.success) {
        console.log(
          "Error: " + resOne.error.error + "\nMessage: " + resOne.error.message
        );
        return false;
      }
      if (resOne.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return false;
      }

      // Add the grade and remove the student's id from the regrade set (if it exists)
      resOne.data.grades[studentId] = grade;
      if (resOne.data.regrade.has(studentId))
        resOne.data.regrade.delete(studentId);

      // Update the assignment instance in the database
      const resTwo = await db.editAssignment(resOne.data.id, resOne.data);
      return resTwo.success;
    },
  })
  // Delete a grade for a student's assignment submission
  .mutation("delGrade", {
    meta: TeacherRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { assgId, studentId } }) => {
      // Retrieve the assignment instance from the database
      const resOne = await db.getAssignment(assgId);
      if (!resOne.success) {
        console.log(
          "Error: " + resOne.error.error + "\nMessage: " + resOne.error.message
        );
        return false;
      }
      if (resOne.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return false;
      }

      // Delete the grade and update the instance in the database
      delete resOne.data.grades[studentId];
      const resTwo = await db.editAssignment(resOne.data.id, resOne.data);
      if (!resTwo.success) {
        console.log(
          "Error: " + resTwo.error.error + "\nMessage: " + resTwo.error.message
        );
        return resTwo.success;
      }
      return resTwo.success;
    },
  })
  // Toggle a user's id from the regrade field in the assignment specified by its id
  .mutation("toggleRegrade", {
    meta: AuthRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      userId: UserIdValidator.optional(),
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db, user }, input: { assgId, userId } }) => {
      let studentId = userId || user!.id;
      // Retrieve the assignment instance from the database
      const resOne = await db.getAssignment(assgId);
      if (!resOne.success) {
        console.log(
          "Error: " + resOne.error.error + "\nMessage: " + resOne.error.message
        );
        return false;
      }
      if (resOne.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return false;
      }

      // Check the student has an existing grade
      const hasGrade = resOne.data.grades[studentId];
      if (hasGrade === undefined) {
        console.log(
          `Error: Student ${studentId} does not have a grade for assignment ${assgId}`
        );
        return false;
      }

      // Check if the student's id already exists in the set "regrade"
      const doesExist = resOne.data.regrade.has(studentId);
      if (doesExist)
        resOne.data.regrade.delete(studentId); // Delete from the set
      else resOne.data.regrade.add(studentId); // Add to the set

      // Update the assignment instance in the database
      const resTwo = await db.editAssignment(resOne.data.id, resOne.data);
      return resTwo.success;
    },
  })

  /* ASSIGNMENT COMMENT RELATED */
  // Get the comment given to a student by the instructor for a specified assignment
  .query("comment", {
    meta: AuthRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
    }),
    output: z.nullable(CommentValidator),
    resolve: async ({ ctx: { db }, input: { assgId, studentId } }) => {
      // Retrieve the assignment instance from the database
      const res = await db.getAssignment(assgId);
      if (!res.success) {
        console.log(
          "Error: " + res.error.error + "\nMessage: " + res.error.message
        );
        return null;
      }
      if (res.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return null;
      }

      // Check if the user has a grade for their submission
      const exists = Object.keys(res.data.comments).find(
        (id) => id === studentId
      );
      if (!exists) {
        console.log(
          `Error: user ${studentId} grade for assignment ${assgId} not found`
        );
        return null;
      }
      return res.data.comments[studentId];
    },
  })
  // Add comment for a student's assignment submission
  .mutation("addComment", {
    meta: TeacherRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
      comment: CommentValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { assgId, studentId, comment } }) => {
      // Retrieve the assignment instance from the database
      const resOne = await db.getAssignment(assgId);
      if (!resOne.success) {
        console.log(
          "Error: " + resOne.error.error + "\nMessage: " + resOne.error.message
        );
        return false;
      }
      if (resOne.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return false;
      }

      // Add the comment and update the instance in the database
      resOne.data.comments[studentId] = comment;
      const resTwo = await db.editAssignment(resOne.data.id, resOne.data);
      if (!resTwo.success) {
        console.log(
          "Error: " + resTwo.error.error + "\nMessage: " + resTwo.error.message
        );
        return resTwo.success;
      }
      return resTwo.success;
    },
  })
  // Delete a comment for a student's assignment submission
  .mutation("delComment", {
    meta: TeacherRequired,
    input: z.object({
      assgId: AssignmentIDValidator,
      studentId: UserIdValidator,
    }),
    output: z.boolean(),
    resolve: async ({ ctx: { db }, input: { assgId, studentId } }) => {
      // Retrieve the assignment instance from the database
      const resOne = await db.getAssignment(assgId);
      if (!resOne.success) {
        console.log(
          "Error: " + resOne.error.error + "\nMessage: " + resOne.error.message
        );
        return false;
      }
      if (resOne.data === null) {
        console.log(`Error: Assignment ${assgId} not found`);
        return false;
      }

      // Delete the comment and update the instance in the database
      delete resOne.data.comments[studentId];
      const resTwo = await db.editAssignment(resOne.data.id, resOne.data);
      if (!resTwo.success) {
        console.log(
          "Error: " + resTwo.error.error + "\nMessage: " + resTwo.error.message
        );
        return resTwo.success;
      }
      return resTwo.success;
    },
  });

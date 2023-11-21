import { z } from "zod";
import {
  AssignmentIDValidator,
  AssignmentInputValidator,
  AssignmentMutableInputValidator,
  AssignmentValidator,
} from "../../utils/types/Assignment";
//import database from "../FakeDatabase";
import {
  DatabaseResponseValidator,
  EmptyDatabaseResponseValidator,
} from "../types";

const addAssignment = z
  .function()
  .args(AssignmentValidator)
  .returns(EmptyDatabaseResponseValidator);

const getAssignment = z
  .function()
  .args(AssignmentIDValidator)
  .returns(DatabaseResponseValidator(AssignmentValidator.nullable()));

const deleteAssignment = z
  .function()
  .args(AssignmentIDValidator)
  .returns(EmptyDatabaseResponseValidator);

const editAssignment = z
  .function()
  .args(AssignmentIDValidator, AssignmentMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

export const AssignmentDatabaseInterfaceMethods = {
  addAssignment,
  getAssignment,
  deleteAssignment,
  editAssignment,
};
export const AssignmentDatabaseInterface = z.object(AssignmentDatabaseInterfaceMethods);
export type AssignmentDatabaseInterface = z.infer<typeof AssignmentDatabaseInterface>;
/** Note:
 * Functions that add/get can possibly return success:false & error:{error, message}
 * Functions that edit/delete will always return succuss:true
 **/
/* ASSIGNMENT INSTANCE RELATED */

// /* ASSIGNMENT UPLOAD RELATED */
// const getSubmission = z
//     .function()
//     .args(AssignmentIDValidator, UserIdValidator)
//     .returns(z.promise(DatabaseResponseValidator(z.nullable(z.string()))));

// const uploadSubmission = z
//     .function()
//     .args(AssignmentIDValidator, UserIdValidator, z.string())
//     .returns(z.promise(DatabaseResponseValidator(z.undefined())));

// /* ASSIGNMENT GRADE RELATED */
// const getGrade = z
//     .function()
//     .args(AssignmentIDValidator, UserIdValidator)
//     .returns(z.promise(DatabaseResponseValidator(z.nullable(GradeValidator))));

// const addGrade = z
//     .function()
//     .args(AssignmentIDValidator, UserIdValidator, GradeValidator)
//     .returns(z.promise(DatabaseResponseValidator(z.undefined())));

// const deleteGrade = z
//     .function()
//     .args(AssignmentIDValidator, UserIdValidator)
//     .returns(z.promise(EmptyDatabaseResponseValidator));

// export const FakeAssignmentDatabaseAccessor: z.infer<
//   typeof AssignmentDatabaseInterface
// > = {
//   getAssignment: getAssignment.implement(async (ID) => {
//     const assg =
//       database.assignments.filter((assg) => assg.id === ID).at(0) || null;
//     if (assg === null)
//       return Promise.resolve({
//         success: false,
//         error: {
//           error: "NotFound",
//           message: "The assignment with id '" + ID + "' does not exist",
//         },
//       });
//     return Promise.resolve({ success: true, data: assg });
//   }),
//   // getCourseAssignments: getCourseAssignments.implement(async (courseCode) => {
//   //     return Promise.resolve({
//   //         success: true,
//   //         data: database.assignments.filter((assg) => assg.courseCode === courseCode)
//   //     });
//   // }),
//   addAssignment: addAssignment.implement(async (newAssg) => {
//     // Search for an assignment that already exists with the identical id
//     const isExist =
//       database.assignments.filter((assg) => assg.id === newAssg.id).at(0) ||
//       null;
//     // Such assignment already exists
//     if (isExist !== null)
//       return Promise.resolve({
//         success: false,
//         error: {
//           error: "BadRequest",
//           message: "An assignment with id '" + newAssg.id + "' already exists",
//         },
//       });
//     // Otherwise, add the assignment to the database
//     database.assignments.push(newAssg);
//     return Promise.resolve({ success: true });
//   }),
//   deleteAssignment: deleteAssignment.implement(async (ID) => {
//     database.assignments = database.assignments.filter(
//       (assg) => assg.id !== ID
//     );
//     return Promise.resolve({ success: true });
//   }),
//   editAssignment: editAssignment.implement(async (ID, newAssg) => {
//     database.assignments = database.assignments.map((databaseAssignment) => {
//       if (databaseAssignment.id === ID) databaseAssignment.update(newAssg);
//       return databaseAssignment;
//     });
//     return Promise.resolve({ success: true });
//   }),

// getSubmission: getSubmission.implement(async (assgID, userID) => {
//     // Retrieve the assignment instance from the database
//     const assg = database.assignments.filter((assg) => assg.id === assgID).at(0) || null;
//     // Assignment instance does not exist
//     if (assg === null) return Promise.resolve({
//         success: false,
//         error: {
//             error: "NotFound",
//             message: "An assignment with id '" + assgID + "' does not exist"
//         }
//     });
//     // Check if the user submitted an assignment
//     if (!assg.checkAssignmentFileExists(userID)) return Promise.resolve({
//         success: false,
//         error: {
//             error: "NotFound",
//             message: "User '" + userID + "' has not made a submission yet"
//         }
//     });
//     // Otherwise, return the content of the submission
//     return Promise.resolve({
//         success: true,
//         data: assg.readFile(userID)
//     });
// }),
// uploadSubmission: uploadSubmission.implement(async (assgID, userID, content) => {
//     // Retrieve the assignment instance from the database
//     const assg = database.assignments.filter((assg) => assg.id === assgID).at(0) || null;
//     // Assignment instance does not exist
//     if (assg === null) return Promise.resolve({
//         success: false,
//         error: {
//             error: "NotFound",
//             message: "An assignment with id '" + assgID + "' does not exist"
//         }
//     });
//     // Otherwise, save the content of the submission in a file
//     assg.writeFile(userID, content);
//     return Promise.resolve({ success: true });
// }),

// getGrade: getGrade.implement(async (assgID, userID) => {
//     const assg = database.assignments.filter((assg) => assg.id === assgID).at(0) || null;
//     if (!assg) return Promise.resolve({
//         success: false,
//         error: {
//             error: "NotFound",
//             message: "The assignment with id '" + assgID + "' does not exist"
//         }
//     });
//     const grade = assg?.grades[userID];
//     if (!assg) return Promise.resolve({
//         success: false,
//         error: {
//             error: "NotFound",
//             message: "User '" + userID + "' does not have a grade for their submission"
//         }
//     });
//     else return Promise.resolve({
//         success: true,
//         data: grade
//     });
// }),
// addGrade: addGrade.implement(async (assgID, userID, grade) => {
//     let updated = 0;
//     database.assignments = database.assignments.map(
//         (databaseAssignment) => {
//             if (databaseAssignment.id === assgID) {
//                 databaseAssignment.grades[userID] = grade;
//                 updated = updated + 1;
//             }
//             return databaseAssignment;
//         }
//     );
//     if (!updated) return Promise.resolve({
//         success: false,
//         error: {
//             error: "NotFound",
//             message: "The assignment with id '" + assgID + "' does not exist"
//         }
//     });
//     return Promise.resolve(
//         { success: true }
//     );
// }),
// deleteGrade: deleteGrade.implement(async (assgID, userID) => {
//     database.assignments = database.assignments.map(
//         (databaseAssignment) => {
//             if (databaseAssignment.id === assgID)
//                 delete databaseAssignment.grades[userID];
//             return databaseAssignment;
//         }
//     );
//     return Promise.resolve(
//         { success: true }
//     );
// }),
//};

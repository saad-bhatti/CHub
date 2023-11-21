import * as fs from "fs";
import { z } from "zod";
import {
  AssignmentCourseCodeValidator,
  AssignmentIDValidator,
} from "./types/Assignment";
import { UserIdValidator } from "./types/User";

/** UPLOADS DIRECTORY RELATED **/
// Create './uploads' directory
export function createUploadsDirectory() {
  if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");
}
// Delete all files within the './uploads'
export function resetUploadsDirectory() {
  if (fs.existsSync("./uploads")) {
    fs.rmSync(`./uploads`, { recursive: true });
    fs.mkdirSync("./uploads");
  }
}

/** COURSE DIRECTORY RELATED **/
// Create './uploads/courseCode' and './uploads/courseCode/modules' directory
export function createCourseDirectory(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>
) {
  if (!fs.existsSync(`./uploads/${courseCode}`)) {
    fs.mkdirSync(`./uploads/${courseCode}/modules`, { recursive: true });
  }
}
// Delete './uploads/courseCode' directory
export function deleteCourseDirectory(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>
) {
  if (fs.existsSync(`./uploads/${courseCode}`))
    fs.rmSync(`./uploads/${courseCode}`, { recursive: true });
}

/** MODULE FILES RELATED **/

// Return names of all files in './uploads/courseCode/modules'
export function getFileNames(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>
) {
  if (fs.existsSync(`./uploads/${courseCode}/modules`)) {
    return fs.readdirSync(`./uploads/${courseCode}/modules`);
  }
  return [];
}
// Return the contents of a file with path './uploads/courseCode/modules/fileName'
export function readCourseFile(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  fileName: string
): string | null {
  if (fs.existsSync(`./uploads/${courseCode}/modules/${fileName}`)) {
    return fs.readFileSync(
      `./uploads/${courseCode}/modules/${fileName}`,
      "utf8"
    );
  }
  return null;
}
// Create and add a file with path './uploads/courseCode/modules/fileName'
export function createCourseFile(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  fileName: string,
  fileData: string
): boolean {
  if (!fs.existsSync(`./uploads/${courseCode}/modules/${fileName}`)) {
    fs.writeFileSync(
      `./uploads/${courseCode}/modules/${fileName}`,
      fileData,
      "utf8"
    );
    return true;
  }
  return false;
}
// Delete a file with path './uploads/courseCode/modules/fileName'
export function deleteCourseFile(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  fileName: string
): boolean {
  if (fs.existsSync(`./uploads/${courseCode}/modules/${fileName}`)) {
    fs.unlinkSync(`./uploads/${courseCode}/modules/${fileName}`);
    return true;
  }
  return false;
}
// Check whether a file with path './uploads/courseCode/modules/fileName' exists
export function checkCourseFileExists(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  fileName: string
): boolean {
  return fs.existsSync(`./uploads/${courseCode}/modules/${fileName}`);
}

/** ASSIGNMENT DIRECTORY RELATED **/
// Create './uploads/courseCode/assignmentID' directory
export function createAssignmentDirectory(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  assignmentID: z.infer<typeof AssignmentIDValidator>
) {
  if (!fs.existsSync(`./uploads/${courseCode}/${assignmentID}`))
    fs.mkdirSync(`./uploads/${courseCode}/${assignmentID}`, {
      recursive: true,
    });
}
// Delete './uploads/courseCode/assignmentID' directory
export function deleteAssignmentDirectory(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  assignmentID: z.infer<typeof AssignmentIDValidator>
) {
  if (fs.existsSync(`./uploads/${courseCode}/${assignmentID}`))
    fs.rmSync(`./uploads/${courseCode}/${assignmentID}`, { recursive: true });
}

/** ASSIGNMENT SUBMISSION RELATED **/
// Return the contents of a file with path './uploads/courseCode/assignmentID/userID'
export function readAssignmentFile(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  assignmentID: z.infer<typeof AssignmentIDValidator>,
  userID: z.infer<typeof UserIdValidator>
): string | null {
  if (fs.existsSync(`./uploads/${courseCode}/${assignmentID}/${userID}`)) {
    return fs.readFileSync(
      `./uploads/${courseCode}/${assignmentID}/${userID}`,
      "utf8"
    );
  }
  return null;
}
// Create and add a file with path './uploads/courseCode/assignmentID/userID'
export function writeAssignmentFile(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  assignmentID: z.infer<typeof AssignmentIDValidator>,
  userID: z.infer<typeof UserIdValidator>,
  content: string
) {
  // Note: writeFileSync will overwrite an existing file with the same name
  fs.writeFileSync(
    `./uploads/${courseCode}/${assignmentID}/${userID}`,
    content,
    "utf8"
  );
}
// Delete a file with path './uploads/courseCode/assignmentID/userID'
export function deleteAssignmentFile(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  assignmentID: z.infer<typeof AssignmentIDValidator>,
  userID: z.infer<typeof UserIdValidator>
) {
  if (fs.existsSync(`./uploads/${courseCode}/${assignmentID}/${userID}`))
    fs.unlinkSync(`./uploads/${courseCode}/${assignmentID}/${userID}`);
}
// Check whether a file with path './uploads/courseCode/assignmentID/userID' exists
export function checkAssignmentFileExists(
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>,
  assignmentID: z.infer<typeof AssignmentIDValidator>,
  userID: z.infer<typeof UserIdValidator>
): boolean {
  return fs.existsSync(`./uploads/${courseCode}/${assignmentID}/${userID}`);
}

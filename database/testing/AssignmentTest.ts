import { invalidId, boolToString, compareObjects } from "./utils";
import { Assignment } from "../../utils/types/Assignment";
import { newCourse } from "./CourseTest";
import type { AssignmentDatabaseInterface } from "../interface/AssignmentDatabaseInterface";
import type { CourseDatabaseInterface } from "../interface/CourseDatabaseInterface";

// Local variables
let testPass: any = "",
  testFail: any = "",
  resCheck: any = "";
let msg: string = "";

// New assignment instance
export let newAssignment = new Assignment({
  id: "A1741852963",
  weight: 1,
  dueDate: new Date(),
  courseCode: newCourse.courseCode,
  grades: {},
  comments: {},
  regrade: new Set(),
  files: new Set(),
  title: "test",
});

async function addAssignmentTest(db: AssignmentDatabaseInterface) {
  msg = "%s%s: Add assignment";
  // Pass: Adding new assignment
  testPass = await db.addAssignment(newAssignment);
  // Fail: Adding duplicate assignment
  testFail = await db.addAssignment(newAssignment);
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getAssignmentTest(db: any) {
  msg = "%s%s: Get assignment";
  // Pass: Get existing assignment
  testPass = await db.getAssignment(newAssignment.id);
  testPass.success =
    testPass.success && compareObjects(newAssignment, testPass.data);
  // Fail: Get non-existant assignment
  testFail = await db.getAssignment(invalidId);
  testFail.success = testFail.success && !testFail.data;
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function editAssignmentTest(db: AssignmentDatabaseInterface) {
  msg = "%s%s: Edit assignment";
  // Pass: Edit existing assignment
  (newAssignment.weight = 2), (newAssignment.files = new Set(["12323852741963"]));
  testPass = await db.editAssignment(newAssignment.id, {
    weight: newAssignment.weight,
    dueDate: newAssignment.dueDate,
    grades: newAssignment.grades,
    comments: newAssignment.comments,
    regrade: newAssignment.regrade,
    files: newAssignment.files,
    title: newAssignment.title,
  });
  resCheck = await db.getAssignment(newAssignment.id);
  testPass.success =
    testPass.success && compareObjects(newAssignment, resCheck.data);
  // Fail: Edit non-existant assignment
  testFail = await db.editAssignment(invalidId, {
    weight: newAssignment.weight,
    dueDate: newAssignment.dueDate,
    grades: newAssignment.grades,
    comments: newAssignment.comments,
    regrade: newAssignment.regrade,
    files: newAssignment.files,
    title: newAssignment.title,
  });
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getCourseAssignmentsTest(db: CourseDatabaseInterface) {
  msg = "%s%s: Get all course assignments";
  // Pass: Get all assignments of existing course
  testPass = await db.getCourseAssignments(newCourse.courseCode);
  testPass.success =
    testPass.success && compareObjects(newAssignment, testPass.data[0]);
  // Fail: Get all assignments of non-existant course
  testFail = await db.getCourseAssignments(invalidId);
  testFail.success = testFail.success && compareObjects([], testFail.data);
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

/* MAIN-TEST */
export async function assignmentTests(db: AssignmentDatabaseInterface & CourseDatabaseInterface) {
  console.log("************* ASSIGNMENT TESTS ***************");
  await addAssignmentTest(db);
  await getAssignmentTest(db);
  await editAssignmentTest(db);
  await getCourseAssignmentsTest(db);
}

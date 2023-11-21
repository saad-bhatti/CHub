import { invalidId, boolToString, compareObjects } from "./utils";
import { Course } from "../../utils/types/Course";
import { newUser } from "./UserTest";
import type { CourseDatabaseInterface } from "../interface/CourseDatabaseInterface";
import type { UserDatabaseInterface } from "../interface/UserDatabaseInterface";

// Local variables
let testPass: any = "",
  testFail: any = "",
  resCheck: any = "";
let msg: string = "";

// New course instance
export let newCourse = new Course({
  courseCode: "CSCB58",
  people: [],
  instructors: [],
  semester: "F",
  location: "SW308",
  status: false,
});

async function addCourseTest(db: CourseDatabaseInterface) {
  msg = "%s%s: Add course";
  // Pass: Adding new course
  testPass = await db.addCourse(newCourse);
  // Fail: Adding duplicate course
  testFail = await db.addCourse(newCourse);
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getCourseTest(db: CourseDatabaseInterface) {
  msg = "%s%s: Get course";
  // Pass: Get existing course
  testPass = await db.getCourse(newCourse.courseCode);
  testPass.success =
    testPass.success && compareObjects(newCourse, testPass.data);
  // Fail: Get non-existant course
  testFail = await db.getCourse(invalidId);
  testFail.success = testFail.success && !testFail.data;
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function editCourseTest(db: CourseDatabaseInterface) {
  msg = "%s%s: Edit course";
  // Pass: Edit existing course
  (newCourse.location = "SW309"), (newCourse.status = true);
  testPass = await db.editCourse(newCourse.courseCode, {
    people: newCourse.people,
    instructors: newCourse.instructors,
    location: newCourse.location,
    status: newCourse.status,
  });
  resCheck = await db.getCourse(newCourse.courseCode);
  testPass.success =
    testPass.success && compareObjects(newCourse, resCheck.data);
  // Fail: Edit non-existant course
  testFail = await db.editCourse(invalidId, {
    people: newCourse.people,
    instructors: newCourse.instructors,
    location: newCourse.location,
    status: newCourse.status,
  });
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function joinCourseTest(db: UserDatabaseInterface & CourseDatabaseInterface) {
  msg = "%s%s%s%s: Join course";
  // Pass: Existing user joins existing course
  newUser.enrolledCourses.push(newCourse.courseCode),
    newCourse.people.push(newUser.id);
  testPass = await db.joinCourse(newUser.id, newCourse.courseCode);
  resCheck = await db.getUser(newUser.id);
  testPass.success = testPass.success && compareObjects(newUser, resCheck.data);
  resCheck = await db.getCourse(newCourse.courseCode);
  testPass.success =
    testPass.success && compareObjects(newCourse, resCheck.data);
  // Fail: Non-existant user joins existing course
  let testFailOne = await db.joinCourse(invalidId, newCourse.courseCode);
  // Fail: Existing user join non-existant course
  let testFailTwo = await db.joinCourse(newUser.id, invalidId);
  // Fail: Non-existant user joins non-existant course
  let testFailThree = await db.joinCourse(invalidId, invalidId);
  console.log(
    msg,
    boolToString(testPass),
    boolToString(!testFailOne.success),
    boolToString(!testFailTwo.success),
    boolToString(!testFailThree.success)
  );
}

/* MAIN-TEST */
export async function courseTests(db: CourseDatabaseInterface & UserDatabaseInterface) {
  console.log("*************** COURSE TESTS *****************");
  await addCourseTest(db);
  await getCourseTest(db);
  await editCourseTest(db);
  await joinCourseTest(db);
}

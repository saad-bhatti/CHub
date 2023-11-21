import { invalidId, boolToString, compareObjects } from "./utils";
import { User } from "../../utils/types/User";
import type { UserDatabaseInterface } from "../interface/UserDatabaseInterface";

// Local variables
let testPass: any = "",
  testFail: any = "",
  resCheck: any = "";
let msg: string = "";

// New user instance
export let newUser = new User({
  type: "Student",
  username: "ezzeldin ismail",
  id: "12323852741963",
  password: "12345678",
  enrolledCourses: [],
  email: "123@gmail.com",
  visible: true,
});

async function addUserTest(db: UserDatabaseInterface) {
  msg = "%s%s: Add user";
  // Pass: Adding new user
  testPass = await db.addUser(newUser);
  // Fail: Adding duplicate user
  testFail = await db.addUser(newUser);
  console.log(
    msg,
    boolToString(testPass.success),
    boolToString(!testFail.success)
  );
}

async function getUserTest(db: UserDatabaseInterface) {
  msg = "%s%s: Get user";
  // Pass: Get existing user
  testPass = await db.getUser(newUser.id);
  testPass.success = testPass.success && compareObjects(newUser, testPass.data);
  // Fail: Get non-existant user
  testFail = await db.getUser(invalidId);
  testFail.success = testFail.success && !testFail.data;
  console.log(
    msg,
    boolToString(testPass.success),
    boolToString(testFail.success)
  );
}

async function editUserTest(db: UserDatabaseInterface) {
  msg = "%s%s: Edit user";
  // Pass: Edit existing user
  newUser.enrolledCourses.push("CSCA08");
  testPass = await db.editUser(newUser.id, {
    username: newUser.username,
    email: newUser.email,
    password: newUser.password,
    enrolledCourses: newUser.enrolledCourses,
    visible: newUser.visible,
  });
  resCheck = await db.getUser(newUser.id);
  testPass.success = testPass.success && compareObjects(newUser, resCheck.data);
  // Fail: Edit a non-existant user
  testFail = await db.editUser(invalidId, {
    username: newUser.username,
    email: newUser.email,
    password: newUser.password,
    enrolledCourses: newUser.enrolledCourses,
    visible: newUser.visible
  });
  console.log(
    msg,
    boolToString(testPass.success),
    boolToString(!testFail.success)
  );
}

/* MAIN-TEST */
export async function userTests(db: UserDatabaseInterface) {
  console.log("**************** USER TESTS ******************");
  await addUserTest(db);
  await getUserTest(db);
  await editUserTest(db);
}

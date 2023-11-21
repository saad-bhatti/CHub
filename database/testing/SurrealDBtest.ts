import getDB, { SurrealInterface } from "../surrealdb/interface/SurrealInterface";
import { newUser, userTests } from "./UserTest";
import { newCourse, courseTests } from "./CourseTest";
import { newAnnouncement, announcementTests } from "./AnnouncementTest";
import { newAssignment, assignmentTests } from "./AssignmentTest";
import { newPost, postTests } from "./PostTest";
import { newComment, commentTests } from "./CommentTest";
import { boolToString } from "./utils";

/** Function: clean the database of the objects added during testing */
async function cleanUp(db: SurrealInterface, numberOfTests: number) {
  console.log("***************** DB CLEAN-UP ****************");
  let res: any = "",
    msg = "",
    i = 1;
  // Array containing the ids of the instances added during testing
  const idArray: string[] = [
    newUser.id,
    newCourse.courseCode,
    newAnnouncement.announcementID,
    newAssignment.id,
    newPost.id,
    newComment.id,
  ];
  // Array containing names of the testing function
  const functionArray: { (id: string): void }[] = [
    db.deleteUser,
    db.deleteCourse,
    db.deleteAnnouncement,
    db.deleteAssignment,
    db.deletePost,
    db.deleteComment,
  ];

  // Delete the instances from the database
  while (i <= numberOfTests) {
    res = await functionArray[i - 1](idArray[i - 1]);
    msg = msg + boolToString(res.success);
    i++;
  }

  // Output the result
  console.log(msg + ": Delete the instances from testing");
  console.log("**********************************************");
}

/** 'SCRIPT' TO BE EXECUTED **/
getDB().then(async (db) => {
  // Array containing names of the testing function
  const testArray: { (db: any): void }[] = [
    userTests,
    courseTests,
    announcementTests,
    assignmentTests,
    postTests,
    commentTests,
  ];
  let i = 1,
    numberOfTests = testArray.length;

  // Run the tests
  while (i <= numberOfTests) {
    await testArray[i - 1](db);
    i++;
  }

  // Clean up the database
  await cleanUp(db, numberOfTests);

  // Close the database connection
  db.conn.close();
});

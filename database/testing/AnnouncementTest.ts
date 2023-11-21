import { invalidId, boolToString, compareObjects } from "./utils";
import { Announcement } from "../../utils/types/Announcement";
import { newUser } from "./UserTest";
import { newCourse } from "./CourseTest";
import type { AnnouncementDatabaseInterface } from "../interface/AnnouncementDatabaseInterface";
import type { CourseDatabaseInterface } from "../interface/CourseDatabaseInterface";

// Local variables
let testPass: any = "",
  testFail: any = "",
  resCheck: any = "";
let msg: string = "";

// New announcement instance
export let newAnnouncement = new Announcement({
  courseCode: newCourse.courseCode,
  instructor: newUser.id,
  title: "test",
  content: "test",
  announcementID: "ann1741852963",
  date: new Date(),
  comments: [],
});

async function addAnnouncementTest(db: AnnouncementDatabaseInterface) {
  msg = "%s%s: Add announcement";
  // Pass: Adding new announcement
  testPass = await db.addAnnouncement(newAnnouncement);
  // Fail: Adding duplicate announcement
  testFail = await db.addAnnouncement(newAnnouncement);
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getAnnouncementTest(db: AnnouncementDatabaseInterface) {
  msg = "%s%s: Get announcement";
  // Pass: Get existing announcement
  testPass = await db.getAnnouncement(newAnnouncement.announcementID);
  testPass.success =
    testPass.success && compareObjects(newAnnouncement, testPass.data);
  // Fail: Get non-existant announcment
  testFail = await db.getAnnouncement(invalidId);
  testFail.success = testFail.success && !testFail.data;
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function editAnnouncementTest(db: AnnouncementDatabaseInterface) {
  msg = "%s%s: Edit announcement";
  // Pass: Edit existing announcement
  (newAnnouncement.content = "New content"),
    (newAnnouncement.title = "New title");
  testPass = await db.editAnnouncement(newAnnouncement.announcementID, {
    content: newAnnouncement.content,
    title: newAnnouncement.title,
    comments: newAnnouncement.comments,
  });
  resCheck = await db.getAnnouncement(newAnnouncement.announcementID);
  testPass.success =
    testPass.success && compareObjects(newAnnouncement, resCheck.data);
  // Fail: Edit non-existant announcement
  testFail = await db.editAnnouncement(invalidId, {
    content: newAnnouncement.content,
    title: newAnnouncement.title,
    comments: newAnnouncement.comments,
  });
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getCourseAnnouncementsTest(db: CourseDatabaseInterface) {
  msg = "%s%s: Get all course announcements";
  // Pass: Get all announcements of existing course
  testPass = await db.getCourseAnnouncements(newCourse.courseCode);
  testPass.success =
    testPass.success && compareObjects(newAnnouncement, testPass.data[0]);
  // Fail: Get all announcements of non-existant course
  testFail = await db.getCourseAnnouncements(invalidId);
  testFail.success = testFail.success && compareObjects([], testFail.data);
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

/* MAIN-TEST */
export async function announcementTests(db: AnnouncementDatabaseInterface & CourseDatabaseInterface) {
  console.log("************ ANNOUNCEMENT TESTS **************");
  await addAnnouncementTest(db);
  await getAnnouncementTest(db);
  await editAnnouncementTest(db);
  await getCourseAnnouncementsTest(db);
}

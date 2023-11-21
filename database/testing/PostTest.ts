import { invalidId, boolToString, compareObjects } from "./utils";
import { Post } from "../../utils/types/Post";
import { newUser } from "./UserTest";
import { newCourse } from "./CourseTest";
import type { PostDatabaseInterface } from "../interface/PostDatabaseInterface";
import type { CourseDatabaseInterface } from "../interface/CourseDatabaseInterface";
import type { UserDatabaseInterface } from "../interface/UserDatabaseInterface";

// Local variables
let testPass: any = "",
  testFail: any = "",
  resCheck: any = "";
let msg: string = "";

// New post instance
export let newPost = new Post({
  type: "Question",
  date: new Date(),
  id: "post14566789",
  course: newCourse.courseCode,
  pinned: false,
  favorite: new Set(),
  owner: newUser.id,
  endorsement: false,
  content: "hello",
  title: "test",
  likes: 1,
});

async function addPostTest(db: PostDatabaseInterface) {
  msg = "%s%s: Add post";
  // Pass: Adding new post
  testPass = await db.addPost(newPost);
  // Fail: Adding duplicate post
  testFail = await db.addPost(newPost);
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getPostTest(db: PostDatabaseInterface) {
  msg = "%s%s: Get post";
  // Pass: Get existing post
  testPass = await db.getPost(newPost.id);
  testPass.success = testPass.success && compareObjects(newPost, testPass.data);
  // Fail: Get non-existant post
  testFail = await db.getPost(invalidId);
  testFail.success = testFail.success && !testFail.data;
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function editPostTest(db: PostDatabaseInterface) {
  msg = "%s%s: Edit post";
  // Pass: Edit existing post
  (newPost.content = "New content"), newPost.likes++;
  testPass = await db.editPost(newPost.id, {
    type: newPost.type,
    pinned: newPost.pinned,
    endorsement: newPost.endorsement,
    content: newPost.content,
    title: newPost.title,
    likes: newPost.likes,
    favorite: newPost.favorite
  });
  resCheck = await db.getPost(newPost.id);
  testPass.success = testPass.success && compareObjects(newPost, resCheck.data);
  // Fail: Edit non-existant post
  testFail = await db.editPost(invalidId, {
    type: newPost.type,
    pinned: newPost.pinned,
    endorsement: newPost.endorsement,
    content: newPost.content,
    title: newPost.title,
    likes: newPost.likes,
    favorite: newPost.favorite
  });
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getCoursePostsTest(db: CourseDatabaseInterface) {
  msg = "%s%s: Get all course posts";
  // Pass: Get all posts of existing course
  testPass = await db.getCoursePosts(newCourse.courseCode);
  testPass.success =
    testPass.success && compareObjects(newPost, testPass.data[0]);
  // Fail: Get all posts of non-existant course
  testFail = await db.getCoursePosts(invalidId);
  testFail.success = testFail.success && compareObjects([], testFail.data);
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function getUserPostsTest(db: UserDatabaseInterface) {
  msg = "%s%s: Get all user posts";
  // Pass: Get all posts of existing user
  testPass = await await db.getUserPosts(newUser.id);
  testPass.success =
    testPass.success && compareObjects(newPost, testPass.data[0]);
  // Fail: Get all posts of non-existant user
  testFail = await db.getUserPosts(invalidId);
  testFail.success = testFail.success && compareObjects([], testFail.data);
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

/* MAIN-TEST */
export async function postTests(db: PostDatabaseInterface & CourseDatabaseInterface & UserDatabaseInterface) {
  console.log("**************** POST TESTS ******************");
  await addPostTest(db);
  await getPostTest(db);
  await editPostTest(db);
  await getCoursePostsTest(db);
  await getUserPostsTest(db);
}

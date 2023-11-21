import { invalidId, boolToString, compareObjects } from "./utils";
import { PostComment } from "../../utils/types/PostComment";
import { newUser } from "./UserTest";
import { newPost } from "./PostTest";
import type { CommentDatabaseInterface } from "../interface/CommentDatabaseInterface";
import type { PostDatabaseInterface } from "../interface/PostDatabaseInterface";
import type { UserDatabaseInterface } from "../interface/UserDatabaseInterface";

// Local variables
let testPass: any = "",
  testFail: any = "",
  resCheck: any = "";
let msg: string = "";

export let newComment = new PostComment({
  date: new Date(),
  id: "C1456789963",
  content: "test",
  ownerId: newUser.id,
  resolved: true,
  postId: newPost.id,
  endorsement: false,
  pinned: false,
});

async function addCommentTest(db: CommentDatabaseInterface) {
  msg = "%s%s: Add post comment";
  // Pass: Adding new post comment
  testPass = await db.addComment(newComment);
  // Fail: Adding duplicate post comment
  testFail = await db.addComment(newComment);
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getCommentTest(db: CommentDatabaseInterface) {
  msg = "%s%s: Get post comment";
  // Pass: Get existing post comment
  testPass = await db.getComment(newComment.id);
  testPass.success =
    testPass.success && compareObjects(newComment, testPass.data);
  // Fail: Get non-existant post
  testFail = await db.getComment(invalidId);
  testFail.success = testFail.success && !testFail.data;
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function editCommentTest(db: CommentDatabaseInterface) {
  msg = "%s%s: Edit post comment";
  // Pass: Edit existing post comment
  newComment.content = "New comment content";
  testPass = await db.editComment(newComment.id, {
    content: newComment.content,
    endorsement: newComment.endorsement,
    pinned: newComment.pinned,
    resolved: newComment.resolved,
  });
  resCheck = await db.getComment(newComment.id);
  testPass.success =
    testPass.success && compareObjects(newComment, resCheck.data);
  // Fail: Edit non-existant post comment
  testFail = await db.editComment(invalidId, {
    content: newComment.content,
    endorsement: newComment.endorsement,
    pinned: newComment.pinned,
    resolved: newComment.resolved,
  });
  console.log(msg, boolToString(testPass), boolToString(!testFail.success));
}

async function getPostCommentsTest(db: PostDatabaseInterface) {
  msg = "%s%s: Get all comments for a post";
  // Pass: Get all comments of existing post
  testPass = await db.getPostComments(newPost.id);
  testPass.success =
    testPass.success && compareObjects(newComment, testPass.data[0]);
  // Fail: Get all comments of non-existant post
  testFail = await db.getPostComments(invalidId);
  testFail.success = testFail.success && compareObjects([], testFail.data);
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

async function getUserCommentedPostsTest(db: UserDatabaseInterface) {
  msg = "%s%s: Get all posts a user commented on";
  // Pass: Get all posts an existing user has commented on
  testPass = await db.getCommentedPosts(newUser.id);
  testPass.success =
    testPass.success && compareObjects(newPost, testPass.data[0]);
  // Fail: Get all posts a non-existant user has commented on
  testFail = await db.getCommentedPosts(invalidId);
  testFail.success = testFail.success && compareObjects([], testFail.data);
  console.log(msg, boolToString(testPass), boolToString(testFail.success));
}

/* MAIN-TEST */
export async function commentTests(db: CommentDatabaseInterface & UserDatabaseInterface & PostDatabaseInterface) {
  console.log("************** COMMENT TESTS *****************");
  await addCommentTest(db);
  await getCommentTest(db);
  await editCommentTest(db);
  await getPostCommentsTest(db);
  await getUserCommentedPostsTest(db);
}

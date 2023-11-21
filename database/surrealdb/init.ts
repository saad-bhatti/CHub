import { Announcement } from "../../utils/types/Announcement";
import { Assignment } from "../../utils/types/Assignment";
import { Course } from "../../utils/types/Course";
import { Post } from "../../utils/types/Post";
import { PostComment } from "../../utils/types/PostComment";
import { User } from "../../utils/types/User";
import SurrealInterface from "./interface/SurrealInterface";

/** 'SCRIPT' TO BE EXECUTED **/
SurrealInterface().then(async (db) => {
  let res: any = "";
  let isSuccess: boolean;

  /** STUDENT-RELATED **/
  isSuccess = true;
  for (const student of students) {
    res = await db.addUser(student);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added students successfully:", "Failed to add all students", {
    ids: "1-7",
    password: studentPassword,
  });

  /** TEACHER-RELATED **/
  isSuccess = true;
  for (const teacher of teachers) {
    res = await db.addUser(teacher);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added teachers successfully:", "Failed to add all teachers", {
    ids: "11-14",
    password: teacherPassword,
  });

  /** COURSE-RELATED **/
  isSuccess = true;
  for (const course of courses) {
    res = await db.addCourse(course);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added courses successfully:", "Failed to add all courses", {
    numCoursesAdded: courses.length
  });

  /** ANNOUNCEMENT-RELATED **/
  isSuccess = true;
  for (const announcement of announcements) {
    res = await db.addAnnouncement(announcement);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added announcements successfully:", "Failed to add all announcements", {
    numAnnouncementsAdded: announcements.length
  });

  /** ANNOUNCEMENT-RELATED **/
  isSuccess = true;
  for (const assignment of assignments) {
    res = await db.addAssignment(assignment);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added assignments successfully:", "Failed to add all assignments", {
    numAssignmentsAdded: assignments.length
  });

  /** POST-RELATED **/
  isSuccess = true;
  for (const post of posts) {
    res = await db.addPost(post);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added posts successfully:", "Failed to add all posts", {
    numPostsAdded: posts.length
  });

  /** POSTCOMMENT-RELATED **/
  isSuccess = true;
  for (const postComment of postComments) {
    res = await db.addComment(postComment);
    isSuccess = isSuccess && res.success;
  };
  outputResult(isSuccess, "Added post comments successfully:", "Failed to add all post comments", {
    numPostCommentsAdded: postComments.length
  });

  db.conn.close();
});

/** STUDENT-INSTANCES **/
// id: 1-7, password: 1
const studentPassword = 1;
const studentEzz = new User({
  type: "Student",
  username: "Ezzeldin",
  id: "123456789",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01", "CSCC63", "CSCD01"],
  email: "ezzeldin.ismail@mail.utoronto.ca",
  visible: true,
});
const studentStephen = new User({
  type: "Student",
  username: "guostep2",
  id: "234567891",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01", "CSCC63"],
  email: "steve.guo@mail.utoronto.ca",
  visible: true,
});
const studentZion = new User({
  type: "Student",
  username: "yinziyao",
  id: "345678912",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01", "CSCC63"],
  email: "ziyao.yin@mail.utoronto.ca",
  visible: true,
});
const studentEsther = new User({
  type: "Student",
  username: "yexinyi5",
  id: "456789123",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01", "CSCC63", "CSCD01"],
  email: "xinyi.ye@mail.utoronto.ca",
  visible: true,
});
const studentJesse = new User({
  type: "Student",
  username: "zhan8648",
  id: "5678912345",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01"],
  email: "jessez.zhang@mail.utoronto.ca",
  visible: false,
});
const studentAwais = new User({
  type: "Student",
  username: "azizawai",
  id: "678912345",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01"],
  email: "awais.aziz@mail.utoronto.ca",
  visible: false,
});
const studentSaad = new User({
  type: "Student",
  username: "bhatti97",
  id: "789123456",
  password: "$2a$10$wrlD.yQZNAlL8u.gbyXwie68.KR5WvVR4Nlew0QO9OHyiDUJfm.16",
  enrolledCourses: ["CSCC01", "CSCC63", "CSCD01"],
  email: "saad.bhatti@mail.utoronto.ca",
  visible: false,
});
const students: User[] = [studentEzz, studentStephen, studentZion, studentEsther, 
  studentJesse, studentAwais, studentSaad];

/** TEACHER-INSTANCES **/
// id: 11-14, password: 2
const teacherPassword = 2;
const teacherIlya = new User({
  type: "Teacher",
  username: "Ilir Dema",
  id: "1234567890",
  password: "$2a$10$/8BZ8oi/1MhF9xxTPkvBn.iFMxsbQA9NTef90bkb9pvnNzzslUxIq",
  enrolledCourses: ["CSCC01", "CSCD01"],
  email: "ilir.dema@mail.utoronto.ca",
  visible: true,
});
const teacherJoy = new User({
  type: "Teacher",
  username: "Manjoy",
  id: "234567890",
  password: "$2a$10$/8BZ8oi/1MhF9xxTPkvBn.iFMxsbQA9NTef90bkb9pvnNzzslUxIq",
  enrolledCourses: ["CSCC01", "CSCD01"],
  email: "manjoy.malhotra@mail.utoronto.ca",
  visible: true,
});
const teacherNick = new User({
  type: "Teacher",
  username: "Nick cheng",
  id: "3456789120",
  password: "$2a$10$/8BZ8oi/1MhF9xxTPkvBn.iFMxsbQA9NTef90bkb9pvnNzzslUxIq",
  enrolledCourses: ["CSCC63"],
  email: "nick@utsc.utoronto.ca",
  visible: true,
});
const teacherRichard = new User({
  type: "Teacher",
  username: "Richard",
  id: "4567891230",
  password: "$2a$10$/8BZ8oi/1MhF9xxTPkvBn.iFMxsbQA9NTef90bkb9pvnNzzslUxIq",
  enrolledCourses: ["CSCC37", "CSCD37"],
  email: "richard.pancer@utoronto.ca",
  visible: false,
});
const teachers: User[] = [teacherIlya, teacherJoy, teacherNick, teacherRichard];

/** COURSE-INSTANCES **/
const courseC01 = new Course({  // Active
  courseCode: "CSCC01",
  people: [studentEzz.id, studentStephen.id, studentZion.id, studentEsther.id,
  studentJesse.id, studentAwais.id, studentSaad.id],
  instructors: [teacherIlya.id, teacherJoy.id],
  semester: "F22",
  location: "SW308",
  status: true,
});
const courseC63 = new Course({  // Active
  courseCode: "CSCC63",
  people: [studentEzz.id, studentStephen.id, studentEsther.id, studentZion.id, studentSaad.id],
  instructors: [teacherNick.id],
  semester: "F22",
  location: "IC204",
  status: true,
});
const courseD01 = new Course({  // Inactive
  courseCode: "CSCD01",
  people: [studentEzz.id, studentEsther.id, studentSaad.id],
  instructors: [teacherIlya.id, teacherJoy.id],
  semester: "W23",
  location: "AA203",
  status: false,
});
const courseC37 = new Course({  // Dummy
  courseCode: "CSCC37",
  people: [],
  instructors: [teacherRichard.id],
  semester: "F22",
  location: "BV264",
  status: true,
});
const courseD37 = new Course({  // Dummy
  courseCode: "CSCC69",
  people: [],
  instructors: [teacherRichard.id],
  semester: "W23",
  location: "HW304",
  status: false,
});
const courses: Course[] = [courseC01, courseC63, courseD01, courseC37, courseD37];

/** ANNOUNCEMENT-INSTANCES **/
const announcement1 = new Announcement({
  courseCode: courseC01.courseCode,
  instructor: teacherIlya.id,
  title: "Welcome to CSCC01 for the Fall 2022 semester",
  content: `
  Hi class,

  Welcome to CSCC01 fopr the Fall 2022 semester!
  
  I am excited for the new semester and hope to see all of you in class this Thursday and Friday, absed on your section.
  
  Meanwhile, please check our course website: https://cmsweb.utsc.utoronto.ca/cscc01f22/index.html
  
  Thanks,
  
  Ilir
  `.trim(),
  announcementID: "announcement1",
  date: new Date(),
  comments: [],
});
const announcement2 = new Announcement({
  courseCode: courseC01.courseCode,
  instructor: teacherIlya.id,
  title: "Jira",
  content: `
  Hi class,

Jira won't be available this week.

Please stay tuned for announcements next week.

Thanks,

Ilir
  `.trim(),
  announcementID: "announcement2",
  date: new Date(),
  comments: [],
});
const announcement3 = new Announcement({
  courseCode: courseC01.courseCode,
  instructor: teacherIlya.id,
  title: "Quiz 3",
  content: `
  Hi class,

This is a gentle reminder there is a quercus quiz due this Friday midnight (opening Thursday 12am). 

The quiz material is based on user stories and INVEST critera.

Thank you!
  `.trim(),
  announcementID: "announcement3",
  date: new Date(),
  comments: [],
});
const announcement4 = new Announcement({
  courseCode: courseC01.courseCode,
  instructor: teacherIlya.id,
  title: "A1 TA office hours today!",
  content: `
  Hi class,

Hemant will be holding office hours 11-12 this morning.

Thank you Hemant!

 

Ilir
  `.trim(),
  announcementID: "announcement4",
  date: new Date(),
  comments: [],
});
const announcement5 = new Announcement({
  courseCode: courseC63.courseCode,
  instructor: teacherNick.id,
  title: "Term test dates",
  content: `
  The Registrar's Office have scheduled the term tests.

Term test 1: Monday, October 17, 5pm (90-minute test).

Term test 2: Monday, November 14, 5pm (90-minute test).

More details will be announced in future announcements.
  `.trim(),
  announcementID: "announcement5",
  date: new Date(),
  comments: [],
});
const announcement6 = new Announcement({
  courseCode: courseC63.courseCode,
  instructor: teacherNick.id,
  title: "WiCSM announcement",
  content: `
  Are you ready to be coached by a Canadian Football League lead Data Engineer?
WiCSM is partnering with the Canadian Football League (CFL) to deliver a mentorship program, open to 3rd + year women in Computer Science, Statistics, & Mathematics.
Mentees will meet up twice per month in one hour sessions to learn about the various tools and technologies that work as the technology backbone of such large organizations. Mentees will also get an opportunity to develop interpersonal skills and meet with the CFL team every month in one of these sessions.
More information is available on the application form, which closes on September 24!: https://forms.gle/x8VH7MJCWhequN8u7
  `.trim(),
  announcementID: "announcement6",
  date: new Date(),
  comments: [],
});
const announcement7 = new Announcement({
  courseCode: courseC63.courseCode,
  instructor: teacherNick.id,
  title: "past exams",
  content: `
  These are the most recent 3 exams that I created for this course.

 https://www.utsc.utoronto.ca/~nick/cscC63/past-exams/
  `.trim(),
  announcementID: "announcement7",
  date: new Date(),
  comments: [],
});
const announcements: Announcement[]= [announcement1, announcement2, announcement3, announcement4, 
  announcement5, announcement6, announcement7];

/** ASSIGNMENT-INSTANCES **/
const assgOne_C01 = new Assignment({ // Assignment to be populated
  id: "C01_quiz1",
  courseCode: courseC01.courseCode,
  dueDate: new Date("2022-09-16"),
  title: "Quiz 1",
  weight: 2,
  grades: { "123456789":100, "234567891": 100, "345678912":66, "456789123":66, "567891234":33, "678912345":33 },
  comments: {
    "123456789": "Perfect, great work! A surprise to be sure but a welcome one.", 
    "234567891": "Perfect, excellent job! We will watch your career with great interest.",
    "345678912": "Almost there! Don't worry though, this is where the fun begins",
    "456789123": "Good attempt! This grade will be a fine addition to your collection.",
    "567891234": "It's over Jesse. You no longer have the high ground nor grades.", 
    "678912345": "Only a Sith deals in absolutes. This why you should drop the course." },
  regrade: new Set([studentEsther.id, studentAwais.id]),
  files: new Set([studentEzz.id, studentStephen.id, studentZion.id, studentEsther.id, studentJesse.id, studentAwais.id]),
});
const assgTwo_C01 = new Assignment({ // Dummy
  id: "C01_quiz2",
  courseCode: courseC01.courseCode,
  dueDate: new Date("2022-09-23"),
  title: "Quiz 2",
  weight: 2,
  grades: { "123456789": 66, "234567891": 100, "345678912": 33, "456789123": 0, "567891234": 66, "678912345": 100, "789123456": 100 },
  comments: {},
  regrade: new Set(),
  files: new Set(),
});
const assgOne_C63 = new Assignment({  // Dummy
  id: "C63_intro",
  courseCode: courseC63.courseCode,
  dueDate: new Date("2022-09-23"),
  title: "An Introduction to Yourself",
  weight: 5,
  grades: {},
  comments: {},
  regrade: new Set(),
  files: new Set(),
});
const assgTwo_C63 = new Assignment({  // Dummy
  id: "C63_prassignment",
  courseCode: courseC63.courseCode,
  dueDate: new Date("2022-10-07"),
  title: "Peer Review",
  weight: 5,
  grades: {},
  comments: {},
  regrade: new Set(),
  files: new Set(),
});
const assignments: Assignment[] = [assgOne_C01, assgTwo_C01, assgOne_C63, assgTwo_C63];

/** POST-INSTANCES **/
const post1 = new Post({
  id: "123456789",
  course: courseC01.courseCode,
  endorsement: false,
  content: `
    What's the best language for the backend? I'm thinking of using Python, but I'm not sure if it's the best choice.
  `.trim(),
  title: "Language choice?",
  date: new Date(),
  type: "Comment",
  likes: 0,
  owner: studentStephen.id,
  pinned: true,
  favorite: new Set([studentEzz.id]),
});
const post2 = new Post({
  id: "234567891",
  course: courseC01.courseCode,
  endorsement: true,
  content: `"123456789"
    Here is a trick I discovered for the first assignment. You can build docker faster by using the --no-cache flag.
  `.trim(),
  title: "Tip for faster docker builds",
  date: new Date(),
  type: "Comment",
  likes: 4,
  owner: studentEzz.id,
  pinned: true,
  favorite: new Set([studentEzz.id, studentStephen.id]),
});
const post3 = new Post({
  id: "345678912",
  course: courseC01.courseCode,
  endorsement: true,
  content: `
    Can we get an extension for A2?
  `.trim(),
  title: "Possible for an extension?",
  date: new Date(),
  type: "Question",
  likes: 48,
  owner: studentAwais.id,
  pinned: true,
  favorite: new Set(),
});
const post4 = new Post({
  id: "456789123",
  course: courseC01.courseCode,
  endorsement: false,
  content: `
  Could we return the uid field in register and login as they allow us to create users stubs in tests independently. 
  If we are not allowed this field, can we assume user and location tests are ran before trip tests as trip depends on the two services?
  `
  .trim(),
  title: "A2 Testing and register uid",
  date: new Date(),
  type: "Question",
  likes: 0,
  owner: studentSaad.id,
  pinned: false,
  favorite: new Set(),
});
const post5 = new Post({
  id: "567891234",
  course: courseC01.courseCode,
  endorsement: false,
  content: `
  Can we create our own test cases or is this file ran before our tests? I did not use this file as there isn't any instruction on how this file is integrated into our tests and I am not sure if we can change docker file or compose to make this work.
  `
  .trim(),
  title: "A2 Setup Data py",
  date: new Date(),
  type: "Question",
  likes: 0,
  owner: studentZion.id,
  pinned: false,
  favorite: new Set(),
});
const post6 = new Post({
  id: "678912345",
  course: courseC01.courseCode,
  endorsement: false,
  content: `
  Could we have A1 Marks before A2's due time so we do not repeat previous mistakes?
  `
  .trim(),
  title: "A1 Marks",
  date: new Date(),
  type: "Question",
  likes: 0,
  owner: studentEsther.id,
  pinned: false,
  favorite: new Set(),
});
const post7 = new Post({
  id: "789123456",
  course: courseC63.courseCode,
  endorsement: false,
  content: `
  Hi, I prefer to write verifiers for some of the questions regarding what NP is closed under. I like this because explaining what the verifier does is difficult without code, especially explaining correctly why it is NP.

If Im not allowed to write verifiers, I understand.
  `
  .trim(),
  title: "Are we allowed to write verifiers on the term test for question 1?",
  date: new Date(),
  type: "Question",
  likes: 0,
  owner: studentJesse.id,
  pinned: false,
  favorite: new Set([studentEzz.id]),
});
const post8 = new Post({
  id: "891234567",
  course: courseC63.courseCode,
  endorsement: false,
  content: `
  Would it be possible for term test 2 grades to be returned by the drop deadline?
  `
  .trim(),
  title: "TT2 grades before deadline",
  date: new Date(),
  type: "Question",
  likes: 3,
  owner: studentAwais.id,
  pinned: false,
  favorite: new Set(),
});
const posts: Post[] = [post1, post2, post3, post4, post5, post6, post7, post8];

/** POSTCOMMENT-INSTANCES **/
const comment1 = new PostComment({
  id: "1123456789",
  ownerId: studentEzz.id,
  content: `
    Python is the best language.
  `.trim(),
  date: new Date(),
  pinned: false,
  resolved: true,
  endorsement: true,
  postId: post1.id,
});
const comment2 = new PostComment({
  id: "1234567892",
  ownerId: studentAwais.id,
  content: `
    Thanks! I will try it out.
  `.trim(),
  date: new Date(),
  pinned: false,
  resolved: false,
  endorsement: false,
  postId: post2.id,
});
const comment3 = new PostComment({
  id: "1345678912",
  ownerId: teacherIlya.id,
  content: `
    Extension granted.
  `.trim(),
  date: new Date(),
  pinned: true,
  resolved: true,
  endorsement: false,
  postId: post3.id,
});
const comment4 = new PostComment({
  id: "1456789123",
  ownerId: teacherJoy.id,
  content: `
  I suggest you write some comments in your test files to notify TA how to run your tests(i.e. what order should we run).

  And you CAN NOT return uid field in register and login. Because it will fail our auto test which is the last thing you want to see.
  `.trim(),
  date: new Date(),
  pinned: true,
  resolved: false,
  endorsement: true,
  postId: post4.id,
});
const comment5 = new PostComment({
  id: "1567891234",
  ownerId: studentZion.id,
  content: `
    I don't think it's allowed.
  `.trim(),
  date: new Date(),
  pinned: true,
  resolved: false,
  endorsement: true,
  postId: post7.id,
});
const comment6 = new PostComment({
  id: "1678912345",
  ownerId: teacherNick.id,
  content: `
    Yes it would.
  `.trim(),
  date: new Date(),
  pinned: true,
  resolved: false,
  endorsement: true,
  postId: post8.id,
});
const postComments: PostComment[] = [comment1, comment2, comment3, comment4, comment5, comment6];

/** Depending on value of bool, output result to console **/
function outputResult(
  bool: boolean,
  success: string,
  fail: string,
  data: Object
): null {
  bool ? console.log("+: " + success, data) : console.log("-: " + fail);
  return null;
}

import { Assignment } from "../types/Assignment";
import { Course } from "../types/Course";
import { User } from "../types/User";

// npx ts-node utils/testing/upload.ts
function assert<T>(
  name: string,
  o1: T,
  o2: T,
  pred: (a: T, b: T) => boolean = (a, b) => a === b,
  errms?: string
) {
  if (pred(o1, o2)) {
    console.log(`Test ${name} succeeded.`);
  } else {
    console.log(
      `Test ${name} has failed with ${o1} and ${o2}${
        errms ? " (" + errms + ")" : ""
      }.`
    );
  }
}

const arrayeq = <T>(a: Array<T>, b: Array<T>) =>
  a.every((x, i) => b[i] == x) && a.length === b.length;
const seteq = <T>(a: Set<T>, b: Set<T>) =>
  a.size === b.size && [...a].every((x) => b.has(x));

const user = new User({
  type: "Student",
  username: "ezzeldin",
  id: "100779856",
  password: "12345678",
  enrolledCourses: [],
  email: "123@gmail.com",
  visible: true,
});

const course = new Course({
  courseCode: "CSCC01",
  people: [],
  instructors: [],
  semester: "F",
  location: "SW308",
  status: true,
});

const assignment = new Assignment({
  id: "assignment1",
  courseCode: "CSCC01",
  dueDate: new Date(),
  title: "A1",
  weight: 1,
  grades: {},
  comments: {},
  regrade: new Set(),
  files: new Set(),
});

const files = course.getFileNames();
course.createCourseFile("syllabus", "test syllabus");
assert("Read file", course.readCourseFile("syllabus"), "test syllabus");
assert(
  "Check all files",
  course.getFileNames(),
  files.concat(["syllabus"]),
  arrayeq
);
course.deleteCourseFile("syllabus");
assert("No user submissions", course.getFileNames(), files, arrayeq);

assignment.writeFile(user.id, "first upload");
assert("User submissions", assignment.files, new Set([user.id]), seteq);
assert(
  "User submission exists",
  assignment.checkAssignmentFileExists(user.id),
  true
);
assert("User submission content", assignment.readFile(user.id), "first upload");
assignment.deleteAssignmentFile(user.id);
assert("No submissions exist1", assignment.files, new Set(), seteq);
assert(
  "No submissions exist2",
  assignment.checkAssignmentFileExists(user.id),
  false
);

import { z } from "zod";
import {
  Course,
  CourseCodeValidator,
  CourseMutableInputValidator,
  CoursePermenantAttributes,
  LocationValidator,
  SemesterValidator,
  StatusValidator,
} from "../../../utils/types/Course";
import { UserIdValidator } from "../../../utils/types/User";
import {
  getRecord,
  UserTable,
  CourseTable,
  SurrealIdValidator,
} from "../utils";

export const SurrealCourse = z.object({
  status: StatusValidator,
  semester: SemesterValidator,
  id: CourseCodeValidator,
  people: SurrealIdValidator(UserTable, UserIdValidator).array(),
  location: LocationValidator,
  instructors: SurrealIdValidator(UserTable, UserIdValidator).array(),
});
const permenants = {
  id: CoursePermenantAttributes["courseCode"],
  semester: CoursePermenantAttributes["semester"],
};
export const MutableSurrealCourse = SurrealCourse.omit(permenants);

export function CourseAsRecord(course: Course): z.infer<typeof SurrealCourse> {
  return SurrealCourse.parse({
    status: course.status,
    semester: course.semester,
    id: getRecord(CourseTable, course.courseCode),
    people: course.people.map((s) => getRecord(UserTable, s)),
    location: course.location,
    instructors: course.instructors.map((s) => getRecord(UserTable, s)),
  });
}

export function MutableCourseAsRecord(
  course: z.infer<typeof CourseMutableInputValidator>
): z.infer<typeof MutableSurrealCourse> {
  return MutableSurrealCourse.parse({
    status: course.status,
    people: course.people.map((s) => getRecord(UserTable, s)),
    location: course.location,
    instructors: course.instructors.map((s) => getRecord(UserTable, s)),
  });
}

export function RecordAsCourse(obj: z.infer<typeof SurrealCourse>): Course {
  return new Course({
    courseCode: obj.id.substr(CourseTable.length + 1),
    status: obj.status,
    location: obj.location,
    semester: obj.semester,
    instructors: obj.instructors.map((str) => str.substr(UserTable.length + 1)),
    people: obj.people.map((str) => str.substr(UserTable.length + 1)),
  });
}

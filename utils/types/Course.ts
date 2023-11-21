import { z } from "zod";
import {
  createCourseDirectory,
  createCourseFile,
  deleteCourseFile,
  readCourseFile,
  getFileNames,
} from "../Uploads";
import { UserIdValidator } from "./User";

// Validators for the different properties of courses
export const StatusValidator = z.boolean();
export const SemesterValidator = z.string().min(1, "Course must have semester.");
export const CourseCodeValidator = z.string().min(3, "Course code must be at least 3 characters long.");
export const PeopleValidator = UserIdValidator.array();
export const LocationValidator = z.string().min(1, "Course must have location.");
export const InstructorsValidator = UserIdValidator.array();
export const CoursePermenantAttributes: { courseCode: true; semester: true } = {
  courseCode: true,
  semester: true,
};

// Course object validators
export const CourseInputValidator = z.object({
  status: StatusValidator,
  semester: SemesterValidator,
  courseCode: CourseCodeValidator,
  people: PeopleValidator,
  location: LocationValidator,
  instructors: InstructorsValidator,
});

export const CourseMutableInputValidator = CourseInputValidator.omit(
  CoursePermenantAttributes
);

// Course class that implements course type from Validators
export class Course implements z.infer<typeof CourseInputValidator> {
  status: z.infer<typeof StatusValidator>;
  semester: z.infer<typeof SemesterValidator>;
  courseCode: z.infer<typeof CourseCodeValidator>;
  people: z.infer<typeof PeopleValidator>;
  location: z.infer<typeof LocationValidator>;
  instructors: z.infer<typeof InstructorsValidator>;

  constructor(info: z.infer<typeof CourseInputValidator>) {
    ({
      status: this.status,
      semester: this.semester,
      courseCode: this.courseCode,
      people: this.people,
      location: this.location,
      instructors: this.instructors,
    } = CourseInputValidator.parse(info));
    createCourseDirectory(this.courseCode);
  }

  update(newInfo: z.infer<typeof CourseMutableInputValidator>) {
    ({
      status: this.status,
      people: this.people,
      location: this.location,
      instructors: this.instructors,
    } = CourseMutableInputValidator.parse(newInfo));
  }

  createCourseFile(fileName: string, fileData: string) {
    return createCourseFile(this.courseCode, fileName, fileData);
  }

  readCourseFile(fileName: string): string | null {
    return readCourseFile(this.courseCode, fileName);
  }

  deleteCourseFile(fileName: string) {
    return deleteCourseFile(this.courseCode, fileName);
  }

  getFileNames() {
    return getFileNames(this.courseCode);
  }
}

export const CourseValidator = z.instanceof(Course);
export const InputToCourseValidator = CourseInputValidator.transform((course) => new Course(course));
export const ActiveCourses = CourseValidator.refine((course) => course.status, "Course must be active.");
export const InactiveCourses = CourseValidator.refine((course) => !course.status, "Course must be inactive.");

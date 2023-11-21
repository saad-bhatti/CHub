import { z } from "zod";
import { JSONDate, JSONSet } from "../constants";
import {
  createAssignmentDirectory,
  deleteAssignmentDirectory,
  readAssignmentFile,
  writeAssignmentFile,
  deleteAssignmentFile,
} from "../Uploads";
import { CourseCodeValidator } from "./Course";
import { UserIdValidator } from "./User";

// Validators for the properties of assignments
export const GradeValidator = z.number().min(0, "Grade is a percentage.").max(100, "Grade is a percentage.");
export const AssignmentCourseCodeValidator = CourseCodeValidator;
export const AssignmentGradesValidator = z.record(
  UserIdValidator,
  GradeValidator
);
export const CommentValidator = z.string().max(512, "Comment can only be 512 characters long.");
export const AssignmentRegradeRequestValidator = JSONSet(UserIdValidator);
export const AssignmentCommentsValidator = z.record(
  UserIdValidator,
  CommentValidator
);
export const AssignmentTitleValidator = z.string().min(1, "Assignment must have title");
export const AssignmentFilesValidator = JSONSet(UserIdValidator);
export const AssignmentDueDateValidator = JSONDate;
export const AssignmentWeightValidator = z.number().min(0, "Cannot have assignment with negative weight.").max(100, "Assignment cannot have more than 100% weight.");
export const AssignmentIDValidator = z.string().min(8, "Assignment ID has to be at least 8 characters long.");
export const AssignmentPermenantAttributes: {
  courseCode: true;
  id: true;
} = {
  courseCode: true,
  id: true,
};

// Assignment object validators
export const AssignmentInputValidator = z.object({
  courseCode: AssignmentCourseCodeValidator,
  grades: AssignmentGradesValidator,
  comments: AssignmentCommentsValidator,
  regrade: AssignmentRegradeRequestValidator,
  title: AssignmentTitleValidator,
  files: AssignmentFilesValidator,
  dueDate: AssignmentDueDateValidator,
  weight: AssignmentWeightValidator,
  id: AssignmentIDValidator,
});

export const AssignmentMutableInputValidator = AssignmentInputValidator.omit(
  AssignmentPermenantAttributes
);

// Assignment class that implements assignment type from validator
export class Assignment implements z.infer<typeof AssignmentInputValidator> {
  courseCode: z.infer<typeof AssignmentCourseCodeValidator>;
  grades: z.infer<typeof AssignmentGradesValidator>;
  comments: z.infer<typeof AssignmentCommentsValidator>;
  regrade: z.infer<typeof AssignmentRegradeRequestValidator>;
  title: z.infer<typeof AssignmentTitleValidator>;
  files: z.infer<typeof AssignmentFilesValidator>;
  dueDate: z.infer<typeof AssignmentDueDateValidator>;
  weight: z.infer<typeof AssignmentWeightValidator>;
  id: z.infer<typeof AssignmentIDValidator>;

  constructor(info: z.infer<typeof AssignmentInputValidator>) {
    ({
      courseCode: this.courseCode,
      grades: this.grades,
      comments: this.comments,
      regrade: this.regrade,
      title: this.title,
      files: this.files,
      dueDate: this.dueDate,
      weight: this.weight,
      id: this.id,
    } = AssignmentInputValidator.parse(info));
    createAssignmentDirectory(this.courseCode, this.id);
  }

  update(info: z.infer<typeof AssignmentMutableInputValidator>) {
    ({
      grades: this.grades,
      comments: this.comments,
      regrade: this.regrade,
      title: this.title,
      files: this.files,
      dueDate: this.dueDate,
      weight: this.weight,
    } = AssignmentMutableInputValidator.parse(info));
  }

  readFile(userId: z.infer<typeof UserIdValidator>): string | null {
    return readAssignmentFile(this.courseCode, this.id, userId);
  }

  writeFile(userId: z.infer<typeof UserIdValidator>, content: string): void {
    writeAssignmentFile(this.courseCode, this.id, userId, content);
    this.files.add(userId);
  }

  deleteAssignmentDirectory(): void {
    deleteAssignmentDirectory(this.courseCode, this.id);
    this.files.clear();
  }

  deleteAssignmentFile(userId: z.infer<typeof UserIdValidator>): void {
    deleteAssignmentFile(this.courseCode, this.id, userId);
    this.files.delete(userId);
  }

  checkAssignmentFileExists(userId: z.infer<typeof UserIdValidator>): boolean {
    return this.files.has(userId);
  }
}

export const AssignmentValidator = z.instanceof(Assignment);
export const InputToAssignmentValidator = AssignmentInputValidator.transform((assg) => new Assignment(assg));

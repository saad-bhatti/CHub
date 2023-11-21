import { z } from "zod";
import { UserIdValidator } from "./User";
import { CourseCodeValidator } from "./Course";
import { JSONDate } from "../constants";

// Validators for the properties of announcements
export const AnnouncementCourseCodeValidator = CourseCodeValidator;
export const AnnouncementCommentsValidator = z.array(z.string());
export const AnnouncementTitleValidator = z.string();
export const AnnouncementContentValidator = z.string();
export const AnnouncementDateValidator = JSONDate;
export const AnnouncementIDValidator = z.string();
export const AnnouncementInstructorValidator = UserIdValidator;
export const AnnouncementPermenantAttribute: {
  instructor: true;
  courseCode: true;
  date: true;
  announcementID: true;
} = {
  instructor: true,
  courseCode: true,
  date: true,
  announcementID: true,
};

// Announcement object validators
export const AnnouncementInputValidator = z.object({
  instructor: AnnouncementInstructorValidator,
  courseCode: AnnouncementCourseCodeValidator,
  comments: AnnouncementCommentsValidator,
  title: AnnouncementTitleValidator,
  content: AnnouncementContentValidator,
  date: AnnouncementDateValidator,
  announcementID: AnnouncementIDValidator,
});

export const AnnouncementMutableInputValidator =
  AnnouncementInputValidator.omit(AnnouncementPermenantAttribute);

// Announcement class that implements announcement type from validator
export class Announcement
  implements z.infer<typeof AnnouncementInputValidator>
{
  instructor: z.infer<typeof AnnouncementInstructorValidator>;
  courseCode: z.infer<typeof AnnouncementCourseCodeValidator>;
  comments: z.infer<typeof AnnouncementCommentsValidator>;
  title: z.infer<typeof AnnouncementTitleValidator>;
  content: z.infer<typeof AnnouncementContentValidator>;
  date: z.infer<typeof AnnouncementDateValidator>;
  announcementID: z.infer<typeof AnnouncementIDValidator>;

  constructor(info: z.infer<typeof AnnouncementInputValidator>) {
    ({
      instructor: this.instructor,
      courseCode: this.courseCode,
      comments: this.comments,
      title: this.title,
      content: this.content,
      date: this.date,
      announcementID: this.announcementID,
    } = AnnouncementInputValidator.parse(info));
  }

  update(info: z.infer<typeof AnnouncementMutableInputValidator>) {
    ({
      comments: this.comments,
      title: this.title,
      content: this.content,
    } = AnnouncementMutableInputValidator.parse(info));
  }
}

export const AnnouncementValidator = z.instanceof(Announcement);
export const InputToAnnouncementValidator = AnnouncementInputValidator.transform((announcement) => new Announcement(announcement));

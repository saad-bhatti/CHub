import { z } from "zod";
import {
  Announcement,
  AnnouncementCommentsValidator,
  AnnouncementContentValidator,
  AnnouncementDateValidator,
  AnnouncementIDValidator,
  AnnouncementInstructorValidator,
  AnnouncementMutableInputValidator,
  AnnouncementPermenantAttribute,
  AnnouncementTitleValidator,
} from "../../../utils/types/Announcement";
import { AssignmentIDValidator } from "../../../utils/types/Assignment";
import {
  CourseCodeValidator,
  CourseValidator,
} from "../../../utils/types/Course";
import { UserIdValidator } from "../../../utils/types/User";
import {
  getRecord,
  AnnouncementTable,
  CourseTable,
  UserTable,
  SurrealIdValidator,
  AssignmentTable,
} from "../utils";

export const SurrealAnnouncement = z.object({
  id: SurrealIdValidator(AnnouncementTable, AssignmentIDValidator),
  comments: AnnouncementCommentsValidator,
  title: AnnouncementTitleValidator,
  content: AnnouncementContentValidator,
  date: AnnouncementDateValidator,
  instructor: SurrealIdValidator(UserTable, UserIdValidator),
  course: SurrealIdValidator(CourseTable, CourseCodeValidator),
});
const permenants = {
  id: AnnouncementPermenantAttribute["announcementID"],
  instructor: AnnouncementPermenantAttribute["instructor"],
  date: AnnouncementPermenantAttribute["date"],
  course: AnnouncementPermenantAttribute["courseCode"],
};
export const MutableSurrealAnnouncement = SurrealAnnouncement.omit(permenants);

export function AnnouncementAsRecord(
  ann: Announcement
): z.infer<typeof SurrealAnnouncement> {
  return SurrealAnnouncement.parse({
    id: getRecord(AnnouncementTable, ann.announcementID),
    comments: ann.comments,
    title: ann.title,
    content: ann.content,
    date: ann.date,
    instructor: getRecord(UserTable, ann.instructor),
    course: getRecord(CourseTable, ann.courseCode),
  });
}

export function MutableAnnouncementAsRecord(
  ann: z.infer<typeof AnnouncementMutableInputValidator>
): z.infer<typeof MutableSurrealAnnouncement> {
  return MutableSurrealAnnouncement.parse({
    comments: ann.comments,
    title: ann.title,
    content: ann.content,
  });
}

export function RecordAsAnnouncement(
  obj: z.infer<typeof SurrealAnnouncement>
): Announcement {
  return new Announcement({
    announcementID: obj.id.substr(AnnouncementTable.length + 1),
    comments: obj.comments,
    title: obj.title,
    date: obj.date,
    content: obj.content,
    instructor: obj.instructor.substr(UserTable.length + 1),
    courseCode: obj.course.substr(CourseTable.length + 1),
  });
}

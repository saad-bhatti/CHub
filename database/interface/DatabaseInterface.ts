import { z } from "zod";
import { AnnouncementDatabaseInterface } from "./AnnouncementDatabaseInterface";
import { AssignmentDatabaseInterface } from "./AssignmentDatabaseInterface";
import { CommentDatabaseInterface } from "./CommentDatabaseInterface";
import { CourseDatabaseInterface } from "./CourseDatabaseInterface";
import { PostDatabaseInterface } from "./PostDatabaseInterface";
import { UserDatabaseInterface } from "./UserDatabaseInterface";

export const DatabaseInterface = UserDatabaseInterface.merge(CourseDatabaseInterface)
  .merge(AnnouncementDatabaseInterface)
  .merge(AssignmentDatabaseInterface)
  .merge(PostDatabaseInterface)
  .merge(CommentDatabaseInterface);

export type DatabaseInterface = z.infer<typeof DatabaseInterface>;

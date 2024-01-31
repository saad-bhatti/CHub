import { z } from "zod";
import {
  AnnouncementIDValidator,
  AnnouncementMutableInputValidator,
  AnnouncementValidator,
} from "../../utils/types/Announcement";
import { DatabaseResponseValidator, EmptyDatabaseResponseValidator } from "../types";

const addAnnouncement = z
  .function()
  .args(AnnouncementValidator)
  .returns(EmptyDatabaseResponseValidator);

const getAnnouncement = z
  .function()
  .args(AnnouncementIDValidator)
  .returns(DatabaseResponseValidator(AnnouncementValidator.nullable()));

const deleteAnnouncement = z
  .function()
  .args(AnnouncementIDValidator)
  .returns(EmptyDatabaseResponseValidator);

const editAnnouncement = z
  .function()
  .args(AnnouncementIDValidator, AnnouncementMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

export const AnnouncementDatabaseInterfaceMethods = {
  addAnnouncement: addAnnouncement,
  getAnnouncement: getAnnouncement,
  deleteAnnouncement: deleteAnnouncement,
  editAnnouncement: editAnnouncement,
};
export const AnnouncementDatabaseInterface = z.object(AnnouncementDatabaseInterfaceMethods);
export type AnnouncementDatabaseInterface = z.infer<typeof AnnouncementDatabaseInterface>;

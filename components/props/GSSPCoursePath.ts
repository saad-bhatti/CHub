import { CourseCodeValidator } from "../../utils/types/Course";
import { GSSPUrlParams } from "./GSSPUrlParam";

export const GSSPCoursePath = GSSPUrlParams({course: CourseCodeValidator});

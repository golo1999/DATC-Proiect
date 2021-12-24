// Models
import CustomDateTime from "../models/CustomDateTime";
import Report from "../models/Report";
import UserPersonalInformation from "../models/UserPersonalInformation";

export const DEFAULT_REPORT = new Report(
  -1,
  "",
  false,
  new CustomDateTime(0, "", 0, 0, 0, "", 0, 0),
  null,
  null,
  "",
  ""
);

export const DEFAULT_USER_PERSONAL_INFORMATION = new UserPersonalInformation();

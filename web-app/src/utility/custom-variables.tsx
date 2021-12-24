// Models
import CustomDate from "../models/CustomDate";
import CustomDateTime from "../models/CustomDateTime";
import Location from "../models/Location";
import Report from "../models/Report";
import UserPersonalInformation from "../models/UserPersonalInformation";

export const DEFAULT_REPORT = new Report(
  -1,
  "",
  false,
  new CustomDateTime(0, "", 0, 0, 0, "", 0, 0),
  new Location(-100, -100),
  "",
  "",
  ""
);

export const DEFAULT_USER_PERSONAL_INFORMATION = new UserPersonalInformation(
  "",
  "",
  "",
  "",
  0,
  "",
  -1,
  new CustomDate(0, "", 0, "", 0),
  ""
);

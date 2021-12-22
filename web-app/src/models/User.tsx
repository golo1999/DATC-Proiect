// Models
import ReportDetails from "./ReportDetails";
import UserPersonalInformation from "./UserPersonalInformation";

class User {
  personalInformation: UserPersonalInformation;
  personalReports: ReportDetails[];

  constructor(
    personalInformation: UserPersonalInformation,
    personalReports: ReportDetails[]
  ) {
    this.personalInformation = personalInformation;
    this.personalReports = personalReports;
  }
}

export default User;

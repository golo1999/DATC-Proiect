// Models
import Report from "./Report";
import UserPersonalInformation from "./UserPersonalInformation";

class User {
  personalInformation: UserPersonalInformation;
  personalReports: Report[];

  constructor(
    personalInformation: UserPersonalInformation,
    personalReports: Report[]
  ) {
    this.personalInformation = personalInformation;
    this.personalReports = personalReports;
  }
}

export default User;

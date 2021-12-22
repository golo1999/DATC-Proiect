import CustomDateTime from "./CustomDateTime";
import Location from "./Location";

class ReportDetails {
  category: number;
  checkStatus: boolean;
  dateTime: CustomDateTime;
  location: Location;
  note: string;
  reportId: string;
  userId: string;

  constructor(
    category: number,
    checkStatus: boolean,
    dateTime: CustomDateTime,
    location: Location,
    note: string,
    reportId: string,
    userId: string
  ) {
    this.category = category;
    this.checkStatus = checkStatus;
    this.dateTime = dateTime;
    this.location = location;
    this.note = note;
    this.reportId = reportId;
    this.userId = userId;
  }
}

export default ReportDetails;

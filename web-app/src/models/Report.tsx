import CustomDateTime from "./CustomDateTime";
import Location from "./Location";

class Report {
  category: number;
  checkedBy: string | null = null;
  checkStatus: boolean = false;
  dateTime: CustomDateTime;
  location: Location;
  note: string;
  reportId: string;
  userId: string;

  constructor(
    category: number,
    checkedBy: string,
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
    this.note = note;
    this.location = location;
    this.reportId = reportId;
    this.userId = userId;

    if (checkedBy) {
      this.checkedBy = checkedBy;
    }
  }
}

export default Report;

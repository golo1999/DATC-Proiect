class UserPersonalInformation {
  admin: boolean = false;
  day: number;
  dayName: string;
  month: number;
  monthName: string;
  year: number;

  constructor(
    day: number,
    dayName: string,
    month: number,
    monthName: string,
    year: number
  ) {
    this.day = day;
    this.dayName = dayName;
    this.month = month;
    this.monthName = monthName;
    this.year = year;
  }
}

export default UserPersonalInformation;

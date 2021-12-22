class CustomDateTime {
  day: number;
  dayName: string;
  hour: number;
  minute: number;
  month: number;
  monthName: string;
  second: number;
  year: number;

  constructor(
    day: number,
    dayName: string,
    hour: number,
    minute: number,
    month: number,
    monthName: string,
    second: number,
    year: number
  ) {
    this.day = day;
    this.dayName = dayName;
    this.hour = hour;
    this.minute = minute;
    this.month = month;
    this.monthName = monthName;
    this.second = second;
    this.year = year;
  }
}

export default CustomDateTime;

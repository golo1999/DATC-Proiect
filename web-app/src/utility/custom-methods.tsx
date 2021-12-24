// Models
import AdminPersonalInformation from "../models/AdminPersonalInformation";
import CustomDateTime from "../models/CustomDateTime";
import Location from "../models/Location";
import UserPersonalInformation from "../models/UserPersonalInformation";

export const emailIsValid = (email: string): boolean => {
  const expression =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return expression.test(String(email).trim().toLowerCase());
};

export const getFormattedCategoryName = (categoryIndex: number): string => {
  return categoryIndex === 0
    ? "Danger"
    : categoryIndex === 1
    ? "Garbage"
    : categoryIndex === 2
    ? "Pothole"
    : "Vandalism";
};

export const getFormattedDateTime = (dateTime: CustomDateTime): string => {
  const formattedDateTime =
    (dateTime.day < 10 ? "0" + dateTime.day : dateTime.day) +
    "/" +
    (dateTime.month < 10 ? "0" + dateTime.month : dateTime.month) +
    "/" +
    dateTime.year +
    " " +
    (dateTime.hour < 10 ? "0" + dateTime.hour : dateTime.hour) +
    ":" +
    (dateTime.minute < 10 ? "0" + dateTime.minute : dateTime.minute) +
    ":" +
    (dateTime.second < 10 ? "0" + dateTime.second : dateTime.second);

  return formattedDateTime;
};

export const getFormattedLocation = (location: Location): string => {
  return location
    ? location.city + " | " + location.regionName + " | " + location.country
    : "Unknown";
};

export const getFormattedName = (
  personalInformation: AdminPersonalInformation | UserPersonalInformation
): string => {
  return personalInformation.firstName && personalInformation.lastName
    ? personalInformation.firstName + " " + personalInformation.lastName
    : "Unknown";
};

export const getFormattedTaxReduction = (
  personalInformation: UserPersonalInformation
): string => {
  return personalInformation.taxReduction != null
    ? `${personalInformation.taxReduction}%`
    : `Unknown`;
};

export const getGoogleMapsURL = (): string => {
  const { REACT_APP_GOOGLE_KEY: GOOGLE_KEY } = process.env;

  return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`;
};

export const loginIsValid = (email: string, password: string): boolean => {
  return emailIsValid(email) && passwordIsValid(password);
};

export const nameIsValid = (name: string): boolean => {
  const expression = /^[a-zA-Z]+$/;

  if (String(name).trim().length < 2) {
    return false;
  }

  return expression.test(String(name).trim());
};

export const passwordIsValid = (password: string): boolean => {
  return password.length >= 8;
};

export const registrationIsValid = (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): boolean => {
  return (
    emailIsValid(email) &&
    passwordIsValid(password) &&
    nameIsValid(firstName) &&
    nameIsValid(lastName)
  );
};

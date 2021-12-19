export const emailIsValid = (email) => {
  const expression =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return expression.test(String(email).trim().toLowerCase());
};

export const getFormattedCategoryName = (categoryIndex) => {
  return categoryIndex === 0
    ? "Danger"
    : categoryIndex === 1
    ? "Garbage"
    : categoryIndex === 2
    ? "Pothole"
    : "Vandalism";
};

export const getFormattedDateTime = (dateTime) => {
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

export const getFormattedLocation = (location) => {
  return location
    ? location.city + " | " + location.regionName + " | " + location.country
    : "Unknown";
};

export const getFormattedName = (personalInformation) => {
  return personalInformation.firstName && personalInformation.lastName
    ? personalInformation.firstName + " " + personalInformation.lastName
    : "Unknown";
};

export const getGoogleMapsURL = () => {
  const { REACT_APP_GOOGLE_KEY: GOOGLE_KEY } = process.env;

  return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`;
};

export const loginIsValid = (email, password) => {
  return emailIsValid(email) && passwordIsValid(password);
};

export const nameIsValid = (name) => {
  const expression = /^[a-zA-Z]+$/;

  if (String(name).trim().length < 2) {
    return false;
  }

  return expression.test(String(name).trim());
};

export const passwordIsValid = (password) => {
  return password.length >= 8;
};

export const registrationIsValid = (email, password, firstName, lastName) => {
  return (
    emailIsValid(email) &&
    passwordIsValid(password) &&
    nameIsValid(firstName) &&
    nameIsValid(lastName)
  );
};

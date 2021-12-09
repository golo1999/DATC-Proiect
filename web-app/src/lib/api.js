import { onValue, ref } from "firebase/database";

import { db } from "../Firebase";

const { REACT_APP_REALTIME_DATABASE_URL: FIREBASE_DOMAIN } = process.env;

export const fetchCurrentLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=223");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Couldn't fetch your location");
  }

  return { latitude: data.lat, longitude: data.lon };
};

export async function getAllReports() {
  const response = await fetch(`${FIREBASE_DOMAIN}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch quotes.");
  }

  console.log(data);

  const reportsList = [];

  return reportsList;
}

export const getNumberOfSolvedReports = async (userId) => {
  const reportsListRef = ref(db, `usersList/${userId}/personalReports`);

  let numberOfSolvedReports = 0;

  onValue(reportsListRef, (snapshot) => {
    const data = snapshot.val();

    const personalReportsList = Object.values(data);

    personalReportsList.forEach((report) => {
      if (report.checkedStatus) {
        ++numberOfSolvedReports;
      }
    });
  });

  return numberOfSolvedReports;
};

export const getUserPersonalInformation = async (userId) => {
  const userPersonalInformationRef = ref(
    db,
    `usersList/${userId}/personalInformation`
  );

  let personalInformation = {};

  onValue(userPersonalInformationRef, (snapshot) => {
    const data = snapshot.val();

    personalInformation = data;
  });

  return personalInformation;
};

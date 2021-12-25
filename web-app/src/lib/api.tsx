// NPM
import { onValue, ref, set } from "firebase/database";

// Models
import Report from "../models/Report";
import User from "../models/User";
import UserPersonalInformation from "../models/UserPersonalInformation";
import {
  DEFAULT_REPORT,
  DEFAULT_USER_PERSONAL_INFORMATION,
} from "../utility/custom-variables";

// Utility
import { db } from "../utility/firebase";

export const getNumberOfSolvedReports = async (
  userId: string
): Promise<number> => {
  const reportsListRef = ref(db, `usersList/${userId}/personalReports`);

  let numberOfSolvedReports = 0;

  onValue(reportsListRef, (snapshot) => {
    const data = snapshot.val();

    const personalReportsList: Report[] = Object.values(data);

    personalReportsList.forEach((report) => {
      if (report.checkStatus) {
        ++numberOfSolvedReports;
      }
    });
  });

  return numberOfSolvedReports;
};

export const getReportDetails = async (reportId: string): Promise<Report> => {
  const usersListRef = ref(db, "usersList");

  let reportDetails = DEFAULT_REPORT;

  onValue(usersListRef, (snapshot) => {
    const data = snapshot.val();

    const usersList: User[] = Object.values(data);

    usersList.forEach((user) => {
      const personalReportsList: Report[] = Object.values(user.personalReports);

      personalReportsList.forEach((report) => {
        if (report.reportId === reportId) {
          reportDetails = report;
        }
      });
    });
  });

  return reportDetails;
};

export const getUserPersonalInformation = async (
  userId: string
): Promise<UserPersonalInformation> => {
  const userPersonalInformationRef = ref(
    db,
    `usersList/${userId}/personalInformation`
  );

  let personalInformation: UserPersonalInformation =
    DEFAULT_USER_PERSONAL_INFORMATION;

  onValue(userPersonalInformationRef, (snapshot) => {
    const data = snapshot.val();

    personalInformation = data;
  });

  return personalInformation;
};

export const updateUserLevel = (userId: string): void => {
  const numberOfSolvedReportsPromise = getNumberOfSolvedReports(userId);

  numberOfSolvedReportsPromise.then((result) => {
    const userPersonalInformationRef = ref(
      db,
      `usersList/${userId}/personalInformation`
    );

    const newUserLevel = result / 5 + 1;

    const newUserTaxReduction = 0.25 * (newUserLevel - 1);

    const userPersonalInformationPromise = getUserPersonalInformation(userId);

    userPersonalInformationPromise.then((result) => {
      const personalInformation = result;

      if (personalInformation !== DEFAULT_USER_PERSONAL_INFORMATION) {
        if (personalInformation.level !== newUserLevel) {
          personalInformation.level = newUserLevel;
        }

        if (personalInformation.taxReduction !== newUserTaxReduction) {
          personalInformation.taxReduction = newUserTaxReduction;
        }

        set(userPersonalInformationRef, personalInformation);
      }
    });
  });
};

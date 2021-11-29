import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

import ReportItem from "./ReportItem";

import classes from "./AllReports.module.css";

const AllReports = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  const [reportsList, setReportsList] = useState([]);

  const fetchAllReports = async () => {
    const array = [];

    const db = getDatabase();

    const usersListRef = ref(db, "usersList");

    onValue(usersListRef, (snapshot) => {
      const data = snapshot.val();

      const usersList = Object.values(data);

      usersList.forEach((userDetails) => {
        const userData = userDetails;

        const userPersonalReportsList = Object.values(userData.personalReports);

        userPersonalReportsList.forEach((report) => {
          array.push(report);
        });
      });
    });

    return array;
  };

  useEffect(() => {
    const array = fetchAllReports();

    array.then((result) => {
      setIsLoading(false);
      setReportsList(result);
    });

    return array;
  }, []);

  console.log(reportsList);

  return (
    <div className={classes.container}>
      <ul>
        {reportsList.map((report, index) => (
          <ReportItem key={`report` + index} report={report} />
        ))}
      </ul>
    </div>
  );
};

export default AllReports;

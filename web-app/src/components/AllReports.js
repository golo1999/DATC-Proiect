import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

const AllReports = (props) => {
  const [reportsList, setReportsList] = useState([]);

  const fetchAllReports = async () => {
    const db = getDatabase();

    const usersListRef = ref(db, "usersList");

    onValue(usersListRef, (snapshot) => {
      const data = snapshot.val();

      const usersList = Object.values(data);

      usersList.forEach((userDetails) => {
        const userData = userDetails;

        const userPersonalReportsList = Object.values(userData.personalReports);

        userPersonalReportsList.forEach((report) => {
          setReportsList([...reportsList, report]);
          // console.log(report);
        });
      });
    });
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  console.log(reportsList);

  return <div>All reports</div>;
};

export default AllReports;

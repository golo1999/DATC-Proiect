// Redux
import { locationActions } from "./location-slice";
import { reportsListActions } from "./reports-list-slice";

const { REACT_APP_REALTIME_DATABASE_URL: DATABASE_URL } = process.env;

export const fetchReportsList = () => {
  return async (dispatch) => {
    const fetchUsersList = async () => {
      const response = await fetch(`${DATABASE_URL}/usersList.json`);

      if (!response.ok) {
        throw new Error("Couldn't fetch your location!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const usersList = Object.values(await fetchUsersList());

      dispatch(reportsListActions.clearReportsList());

      dispatch(locationActions.clearReportsLocationList());

      usersList.forEach((user) => {
        const personalReportsList = Object.values(user.personalReports);

        personalReportsList.forEach((report) => {
          const reportLocation = report.location;

          dispatch(reportsListActions.addReport({ report }));

          if (reportLocation) {
            dispatch(
              locationActions.addReportLocation({
                newReportLocation: {
                  id: report.reportId,
                  category: report.category,
                  name: report.note ? report.note : "No note provided",
                  position: {
                    lat: reportLocation.latitude,
                    lng: reportLocation.longitude,
                  },
                },
              })
            );
          }

          console.log(report);
        });
      });

      //   console.log(`users list`);
      //   console.log(usersList);
    } catch (error) {}
  };
};

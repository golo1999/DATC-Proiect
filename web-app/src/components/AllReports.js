import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";

import ReportItem from "./ReportItem";

import classes from "./AllReports.module.css";

const AllReports = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  const reportsList = props.reports;

  useEffect(() => {
    setIsLoading((previousValue) => !previousValue);
  }, []);

  // const sortReportsByDateDescending = (reportsList) => {
  //   return reportsList.sort((firstReport, secondReport) => {
  //     const firstReportDate = firstReport.dateTime;

  //     const secondReportDate = secondReport.dateTime;

  //     const firstReportParsedDate = new Date(
  //       firstReportDate.year,
  //       firstReportDate.month - 1,
  //       firstReportDate.day,
  //       firstReportDate.hour,
  //       firstReportDate.minute,
  //       firstReportDate.second
  //     );

  //     const secondReportParsedDate = new Date(
  //       secondReportDate.year,
  //       secondReportDate.month - 1,
  //       secondReportDate.day,
  //       secondReportDate.hour,
  //       secondReportDate.minute,
  //       secondReportDate.second
  //     );

  //     console.log("firstReportDateParsed", firstReportParsedDate);
  //     console.log("secondReportDateParsed", secondReportParsedDate);
  //     console.log("<", +secondReportParsedDate < +firstReportParsedDate);
  //     return +secondReportParsedDate > +firstReportParsedDate;
  //   });
  // };

  // useEffect(() => {
  //   const array = fetchAllReports();

  //   array.then((result) => {
  //     setIsLoading(false);
  //     setReportsList(result);
  //   });

  //   return array;
  // }, []);

  // console.log("Reports sorted descending by date");

  // console.log(sortReportsByDateDescending(reportsList));

  return (
    <div className={classes.container}>
      <ul>
        {isLoading && (
          <Container className={classes["spinner-container"]}>
            <Spinner
              className={classes.spinner}
              animation="border"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        )}
        {!isLoading &&
          reportsList.length > 0 &&
          reportsList.map((report, index) => (
            <ReportItem key={`report` + index} report={report} />
          ))}
      </ul>
    </div>
  );
};

export default AllReports;

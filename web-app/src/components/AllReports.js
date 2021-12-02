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

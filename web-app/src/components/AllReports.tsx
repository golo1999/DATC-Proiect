// NPM
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";

// Custom components
import ReportItem from "./ReportItem";

// Models
import Report from "../models/Report";

// Custom CSS
import classes from "./AllReports.module.css";

type Props = { reportsList: Report[] };

const AllReports = ({ reportsList }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading((previousValue) => !previousValue);
  }, []);

  return (
    <div
      className={
        !isLoading && reportsList.length !== 0
          ? classes.container
          : classes["empty-container"]
      }
    >
      {isLoading && (
        <Container className={classes["spinner-container"]}>
          <Spinner className={classes.spinner} animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      )}
      {!isLoading && reportsList.length > 0 && (
        <ul>
          {reportsList.map((report, index) => (
            <ReportItem key={`report` + index} report={report} />
          ))}
        </ul>
      )}
      {!isLoading && reportsList.length === 0 && <h2>No reports found</h2>}
    </div>
  );
};

export default AllReports;

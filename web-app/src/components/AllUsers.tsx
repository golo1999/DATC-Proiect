// NPM
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";

// Models
import User from "../models/User";

// Custom components
import UserItem from "./UserItem";

// Custom CSS
import classes from "./AllUsers.module.css";

type Props = { usersList: User[] };

const AllUsers = ({ usersList }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

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
          usersList.length > 0 &&
          usersList.map((user, index) => (
            <UserItem key={`user` + index} user={user} />
          ))}
      </ul>
    </div>
  );
};

export default AllUsers;
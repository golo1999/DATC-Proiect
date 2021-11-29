import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

import UserItem from "./UserItem";

import classes from "./AllUsers.module.css";

const AllUsers = (props) => {
  const [usersList, setUsersList] = useState([]);

  const fetchAllUsers = async () => {
    const array = [];

    const db = getDatabase();

    const usersListRef = ref(db, "usersList");

    onValue(usersListRef, (snapshot) => {
      const data = snapshot.val();

      const usersList = Object.values(data);

      usersList.forEach((user) => {
        array.push(user);
      });
    });

    return array;
  };

  useEffect(() => {
    const array = fetchAllUsers();

    array.then((result) => {
      setUsersList(result);
    });

    return array;
  }, []);

  console.log(usersList);

  return (
    <div className={classes.container}>
      <ul>
        {usersList.map((user, index) => (
          <UserItem key={`user` + index} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;

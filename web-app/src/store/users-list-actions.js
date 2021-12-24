// Redux
import { usersListActions } from "./users-list-slice";

const { REACT_APP_REALTIME_DATABASE_URL: DATABASE_URL } = process.env;

export const fetchUsersList = () => {
  return async (dispatch) => {
    const fetchUsersList = async () => {
      const response = await fetch(`${DATABASE_URL}/usersList.json`);

      if (!response.ok) {
        throw new Error("Couldn't fetch users list!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const usersList = Object.values(await fetchUsersList());

      dispatch(usersListActions.clearUsersList());

      usersList.forEach((user) => {
        dispatch(usersListActions.addUser({ user }));
      });
    } catch (error) {
      console.log("Couldn't fetch users list!");
    }
  };
};

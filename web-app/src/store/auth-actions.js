import { getAuth } from "firebase/auth";

import { authActions } from "./auth-slice";

export const fetchAuthenticatedAdmin = () => {
  return async (dispatch) => {
    const fetchAdmin = async () => {
      const auth = getAuth();

      const admin = auth.currentUser;

      return admin.uid;
    };

    try {
      const adminId = await fetchAdmin();

      console.log(adminId ? adminId : "no user");
    } catch (error) {
      console.log(error.message);
    }
  };
};

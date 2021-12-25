// NPM
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

// Redux
import { authActions } from "./auth-slice";

export const fetchAuthenticatedAdmin = () => {
  return async (dispatch) => {
    const auth = getAuth();

    const db = getDatabase();

    onAuthStateChanged(auth, (admin) => {
      if (admin && admin.emailVerified) {
        const personalInformationRef = ref(
          db,
          `adminsList/${admin.uid}/personalInformation`
        );

        onValue(personalInformationRef, (snapshot) => {
          const personalInformation = snapshot.val();

          if (personalInformation) {
            dispatch(
              authActions.authenticateAdmin({
                authenticatedAdmin: {
                  email: admin.email,
                  firstName: personalInformation.firstName,
                  id: admin.uid,
                  lastName: personalInformation.lastName,
                },
              })
            );
          }
        });
      }
    });
  };
};

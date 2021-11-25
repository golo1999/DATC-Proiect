import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const {
  REACT_APP_API_KEY: API_KEY,
  REACT_APP_AUTH_DOMAIN: AUTH_DOMAIN,
  REACT_APP_PROJECT_ID: PROJECT_ID,
  REACT_APP_STORAGE_BUCKET: STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID: MESSAGING_SENDER_ID,
  REACT_APP_APP_ID: APP_ID,
  REACT_APP_REALTIME_DATABASE_URL: DATABASE_URL,
} = process.env;

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  databaseURL: DATABASE_URL,
};

const app = firebase.initializeApp(config);

export const auth = app.auth();

export const db = app.database();

export const provider = new firebase.auth.EmailAuthProvider();

export default app;

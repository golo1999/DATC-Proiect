// Models
import AuthenticatedAdmin from "../models/AuthenticatedAdmin";

// Custom CSS
import classes from "./ProfileIcon.module.css";

type Props = { admin: AuthenticatedAdmin };

const ProfileIcon = ({ admin }: Props) => {
  const adminFirstName = admin.firstName;

  const firstLetter = adminFirstName.charAt(0);

  return <div className={classes.container}>{firstLetter}</div>;
};

export default ProfileIcon;

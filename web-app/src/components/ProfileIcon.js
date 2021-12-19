// Custom CSS
import classes from "./ProfileIcon.module.css";

const ProfileIcon = (props) => {
  const authenticatedAdmin = props.admin;

  const adminFirstName = authenticatedAdmin.firstName;

  const firstLetter = adminFirstName.substr(0, 1);

  return <div className={classes.container}>{firstLetter}</div>;
};

export default ProfileIcon;

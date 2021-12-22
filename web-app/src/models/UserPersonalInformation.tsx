// Models
import CustomDate from "./CustomDate";

class UserPersonalInformation {
  admin: boolean = false;
  birthDate?: CustomDate;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  level: number = 1;
  pin: string;
  photoURL?: string;
  taxReduction?: number = 0;

  constructor(
    email: string,
    firstName: string,
    id: string,
    lastName: string,
    level: number,
    pin: string,
    taxReduction: number,
    birthDate?: CustomDate,
    photoURL?: string
  ) {
    this.email = email;
    this.firstName = firstName;
    this.id = id;
    this.lastName = lastName;
    this.level = level;
    this.pin = pin;
    this.taxReduction = taxReduction;

    if (birthDate) {
      this.birthDate = birthDate;
    }

    if (photoURL) {
      this.photoURL = photoURL;
    }
  }
}

export default UserPersonalInformation;

class AuthenticatedAdmin {
  email: string;
  firstName: string;
  id: string;
  lastName: string;

  constructor(email: string, firstName: string, id: string, lastName: string) {
    this.email = email;
    this.firstName = firstName;
    this.id = id;
    this.lastName = lastName;
  }
}

export default AuthenticatedAdmin;

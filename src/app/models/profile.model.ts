export class Profile {
  id: string;
  name: string;
  firstName: string;
  email: string;
  roles: string;

  constructor(id: string, name: string, firstName: string, email: string, roles: string) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.email = email;
    this.roles = roles;
  }
}

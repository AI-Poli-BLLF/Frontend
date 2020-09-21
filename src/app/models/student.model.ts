import {User} from './user.model';

export class Student extends User{
  groupName: string;
  email: string;

  constructor(id: string, name: string, firstName: string, email: string) {
    super(id, name, firstName);
    this.email = email;
    this.groupName = '- -';
  }

}

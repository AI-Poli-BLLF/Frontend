import {User} from './user.model';

export class Student extends User{
  selected: boolean;
  groupName: string;
  email: string;

  constructor(id: string, name: string, firstName: string, email: string) {
    super(id, name, firstName);
    this.selected = false;
    this.email = email;
    this.groupName = '- -';
  }

}

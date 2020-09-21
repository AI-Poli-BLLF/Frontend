import {User} from './user.model';

export class Professor extends User{
  courseNames: string[];

  constructor(id: string, name: string, firstName: string, courseNames: string[] = []) {
    super(id, name, firstName);
    this.courseNames = courseNames;
  }

}

export class Student {
  id: string;
  name: string;
  firstName: string;
  photoName: string;
  selected: boolean;
  groupName: string;
  email: string;

  constructor(id: string, name: string, firstName: string, photoName: string, email: string) {
    this.selected = false;
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.photoName = photoName;
    this.email = email;
    this.groupName = '- -';
  }

  toString(){
    return this.firstName + ' ' + this.name + ' (' + this.id + ')';
  }
}

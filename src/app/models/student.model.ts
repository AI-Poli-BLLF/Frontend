import {SafeUrl} from '@angular/platform-browser';

export class Student {
  id: string;
  name: string;
  firstName: string;
  photoUrl: SafeUrl;
  selected: boolean;
  groupName: string;
  email: string;

  constructor(id: string, name: string, firstName: string, email: string) {
    this.selected = false;
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.photoUrl = 'assets/img/default.png';
    this.email = email;
    this.groupName = '- -';
  }

  toString(){
    return this.firstName + ' ' + this.name + ' (' + this.id + ')';
  }
}

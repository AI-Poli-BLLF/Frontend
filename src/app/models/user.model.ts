import {SafeUrl} from '@angular/platform-browser';

export class User {
  id: string;
  name: string;
  firstName: string;
  photoUrl: SafeUrl;
  selected: boolean;

  constructor(id: string, name: string, firstName: string) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.photoUrl = 'assets/img/default.png';
    this.selected = false;
  }

  toString(){
    return this.firstName + ' ' + this.name + ' (' + this.id + ')';
  }

}

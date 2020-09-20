import {SafeUrl} from '@angular/platform-browser';

export class User {
  id: string;
  name: string;
  firstName: string;
  photoUrl: SafeUrl;

  constructor(id: string, name: string, firstName: string) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.photoUrl = 'assets/img/default.png';
  }

  toString(){
    return this.firstName + ' ' + this.name + ' (' + this.id + ')';
  }
}

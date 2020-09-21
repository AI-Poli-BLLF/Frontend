import {Timestamp} from 'rxjs';

export class Assignment {
  id: number;
  name: string;
  releaseDateT: Date;
  expiryDateT: Date;

  constructor(id: number, name: string, releaseDate: string, expiryDate: string){
    this.id = id;
    this.name = name;
    this.releaseDateT = new Date(releaseDate);
    this.expiryDateT = new Date(expiryDate);
  }

  toString() {
    return this.id + ' name: ' + this.name + ' releaseDate: ' + this.releaseDate + ' expiryDate: ' + this.expiryDate;
  }

  checkTime(i) {
    return (i < 10) ? '0' + i : i;
  }

  getTime(date: Date): string {
    return `${this.checkTime(date.getHours())}:${this.checkTime(date.getMinutes())}`;
  }

  getDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  get releaseDate(){
    return `${this.getTime(this.releaseDateT)} ${this.getDate(this.releaseDateT)}`;
  }

  get expiryDate(){
    return `${this.getTime(this.expiryDateT)} ${this.getDate(this.expiryDateT)}`;
  }

}


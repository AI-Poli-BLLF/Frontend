import {Timestamp} from 'rxjs';

export class Assignment {
  id: number;
  name: string;
  grade: number;
  private releaseDateT: Date;
  private expiryDateT: Date;
  releaseDate: string;
  expiryDate: string;

  constructor(id: number, name: string, releaseDate: string, expiryDate: string){
    this.id = id;
    this.name = name;
    this.releaseDateD = releaseDate;
    this.expiryDateD = expiryDate;
    this.releaseDate = releaseDate;
    this.expiryDate = expiryDate;
  }

  toString() {
    return this.id + ' name: ' + this.name + ' releaseDate: ' + this.releaseDateD + ' expiryDate: ' + this.expiryDateD;
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

  get releaseDateD(){
    return `${this.getTime(this.releaseDateT)} ${this.getDate(this.releaseDateT)}`;
  }

  set releaseDateD(value: string) {
    this.releaseDateT = new Date(value);
  }

  get expiryDateD(){
    return `${this.getTime(this.expiryDateT)} ${this.getDate(this.expiryDateT)}`;
  }

  set expiryDateD(value: string) {
    this.expiryDateT = new Date(value);
  }

}


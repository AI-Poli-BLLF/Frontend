import {Timestamp} from 'rxjs';

export class Assignment {
  id: number;
  name: string;
  releaseDate: Timestamp<any>;
  expiryDate: Timestamp<any>;

  constructor(id: number, name: string, releaseDate: Timestamp<any>, expiryDate: Timestamp<any>){
    this.id = id;
    this.name = name;
    this.releaseDate = releaseDate;
    this.expiryDate = expiryDate;
  }

  toString() {
    return this.id + ' name: ' + this.name + ' releaseDate: ' + this.releaseDate + ' expiryDate: ' + this.expiryDate;
  }

}


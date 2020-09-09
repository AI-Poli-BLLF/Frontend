import {Timestamp} from 'rxjs';
import {Time} from '@angular/common';

export class Assignment {
  id: number;
  name: string;
  releaseDate: Timestamp<any>;
  expiryDate: Timestamp<any>;

  constructor(name: string, releaseDate: Timestamp<any>, expiryDate: Timestamp<any>){
    this.name = name;
    this.releaseDate = releaseDate;
    this.expiryDate = expiryDate;
  }

  toString() {
    return this.id + ' name: ' + this.name + ' releaseDate: ' + this.releaseDate + ' expiryDate: ' + this.expiryDate;
  }
}


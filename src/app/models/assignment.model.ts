import {Timestamp} from 'rxjs';
import {Time} from '@angular/common';

export class Assignment {
  id: string;
  releaseDate: Timestamp<any>;
  expiryDate: Timestamp<any>;

  constructor(id: string, releaseDate: Timestamp<any>, expiryDate: Timestamp<any>){
    this.id = id;
    this.releaseDate = releaseDate;
    this.expiryDate = expiryDate;
  }

  toString() {
    return this.id + ' releaseDate: ' + this.releaseDate + ' expiryDate: ' + this.expiryDate;
  }
}


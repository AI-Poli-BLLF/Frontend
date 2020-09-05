import {Timestamp} from 'rxjs';

export class Draft {
  id: string;
  grade: number;
  state: string;
  timestamp: Timestamp<any>;
  lock: boolean;

  constructor(id: string, timestamp: Timestamp<any>, grade: number, state: string, lock: boolean) {
    this.id = id;
    this.grade = grade;
    this.state = state;
    this.timestamp = timestamp;
    this.lock = lock;
  }
  toString(){
    return this.id + ' state: ' + this.state + ' grade: ' + this.grade + ' timestamp: ' + this.timestamp;
  }
}

import {Timestamp} from 'rxjs';
import {Student} from './student.model';

export class Draft {
  id: number;
  grade: number;
  state: string;
  timestamp: Timestamp<any>;
  lock: boolean;
  student: Student;

  constructor(id: number, timestamp: Timestamp<any>, grade: number, state: string, lock: boolean, student: Student) {
    this.id = id;
    this.grade = grade;
    this.state = state;
    this.timestamp = timestamp;
    this.lock = lock;
    this.student = student;
  }
  toString(){
    return this.id + ' state: ' + this.state + ' grade: ' + this.grade + ' timestamp: ' + this.timestamp + '(' + this.student.toString() + ')';
  }
}

import {Timestamp} from 'rxjs';
import {Student} from './student.model';

export class Draft {
  id: number;
  grade: number;
  state: string;
  timestampT: Date;
  locker: boolean;
  student: Student;

  constructor(id: number, timestamp: string, grade: number, state: string, locker: boolean) {
    this.id = id;
    this.grade = grade;
    this.state = state;
    this.timestampT = new Date(timestamp);
    this.locker = locker;
    this.student = new Student('', '', '', '');
  }
  toString(){
    return this.id + ' state: ' + this.state + ' grade: ' + this.grade + ' timestamp: ' + this.timestamp + '(' + this.student.toString() + ')';
  }

  checkTime(i) {
    return (i < 10) ? '0' + i : i;
  }

  get time(): string {
    return `${this.checkTime(this.timestampT.getHours())}:${this.checkTime(this.timestampT.getMinutes())}`;
  }

  get date(): string {
    return `${this.timestampT.getDate()}/${this.timestampT.getMonth()}/${this.timestampT.getFullYear()}`;
  }

  get timestamp(){
    return `${this.time} ${this.date}`;
  }
}

import {Student} from './student.model';

export class Vm {
  id: number;
  student: Student;
  state: boolean;
  cpu: number;
  ramSize: number;
  diskSize: number;

  constructor(id: number, student: Student, state: boolean, cpu: number, ramSize: number, diskSize: number) {
    this.id = id;
    this.student = student;
    this.state = state;
    this.cpu = cpu;
    this.ramSize = ramSize;
    this.diskSize = diskSize;
  }

  toString(){
    return this.id + ' ' + this.state + ' (' + this.student.id + ')';
  }

  get link(): string {
    // todo: usare url vero
    return 'pippopluto/vms/' + this.id;
  }
}

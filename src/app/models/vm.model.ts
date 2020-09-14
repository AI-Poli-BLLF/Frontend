import {Student} from './student.model';

export class Vm {
  id: number;
  active: boolean;
  cpu: number;
  ramSize: number;
  diskSize: number;
  student: Student;

  constructor(id: number, active: boolean, cpu: number, ramSize: number, diskSize: number) {
    this.id = id;
    this.active = active;
    this.cpu = cpu;
    this.ramSize = ramSize;
    this.diskSize = diskSize;
    this.student = new Student('', '', '', undefined, '');
  }

  toString(){
    return this.id + ' ' + this.active + ' (' + this.student.id + ')';
  }

  get link(): string {
    // todo: usare url vero
    return 'pippopluto/vms/' + this.id;
  }
}

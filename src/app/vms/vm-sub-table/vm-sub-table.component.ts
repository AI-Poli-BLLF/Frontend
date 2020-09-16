import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {Student} from '../../models/student.model';
import {FormControl, Validators} from '@angular/forms';
import {VmConfig} from '../../models/vm.config.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {interval, TimeInterval} from "rxjs";
import {timeInterval} from "rxjs/operators";

@Component({
  selector: 'app-vm-sub-table',
  templateUrl: './vm-sub-table.component.html',
  styleUrls: ['./vm-sub-table.component.css']
})
export class VmSubTableComponent implements OnInit, OnDestroy{
  interval;
  @Input()
  vmConfig: VmConfig;
  @Input()
  courseName: string;

  @Output()
  updateElement = new EventEmitter<VmConfig>();

  vmConfigNew: VmConfig;

  columnsToDisplay: string[] = ['id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize', 'link'];
  dataSource: Vm[];

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  cpu(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.cpu);
    return sum;
  }
  ram(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.ramSize);
    return sum;
  }
  disk(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.diskSize);
    return sum;
  }

  active(){
    return this.dataSource.filter(vm => vm.active).length;
  }

  vmNumber(){
    return this.dataSource.length;
  }


  save(event: VmConfig){
    console.log(event);
    this.courseService.editCourseVmConfig(this.courseName, event.teamId, event.groupName, event)
      .subscribe(
        data => {
          // console.log(data);
          this.updateElement.emit(data);
        },
        error => {
          // console.log(error);
          this.snackBar.open('Si è verificato un errore.', 'Chiudi');
        }
      );
  }

  getVMs(){
    console.log('Get vms');
    this.courseService.getTeamVMs(this.courseName, this.vmConfig.teamId)
      .subscribe(vms => {
        this.dataSource = vms;
        vms.forEach(v => this.getCreator(this.courseName, this.vmConfig.teamId, v.id, v));
      });
  }

  getCreator(courseName: string, teamId: number, vmId: number, vm: Vm) {
    this.courseService.getVmCreator(courseName, teamId, vmId)
      .subscribe(
        data => {
          vm.student = data;
          console.log(this.dataSource);
        },
        error => console.log(error)
      );
  }

  ngOnInit(): void {
    this.dataSource = [];
    this.getVMs();
    // todo: l'effetto dell'aggiornamento è brutto
    this.interval = setInterval(() => this.getVMs(), 10000);
    this.vmConfigNew = new VmConfig(
      this.vmConfig.id, this.vmConfig.teamId, this.vmConfig.groupName,
      this.vmConfig.maxCpu, this.vmConfig.maxRam, this.vmConfig.maxDisk,
      this.vmConfig.maxVm, this.vmConfig.maxActive
    );
    // console.log(this.vmConfigNew);
  }
}

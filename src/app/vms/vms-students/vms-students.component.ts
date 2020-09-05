import {Component, OnDestroy, OnInit} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {Team} from '../../models/team.model';
import {TeamService} from '../../services/team.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {VmConfig} from '../../models/vm.config.model';
import {Course} from '../../models/course.model';
import {CourseService} from '../../services/course.service';
import {AddCourseDialogComponent} from '../../teacher-view/add-course-dialog/add-course-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateVmDialogComponent} from '../create-vm-dialog/create-vm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-vms-students',
  templateUrl: './vms-students.component.html',
  styleUrls: ['./vms-students.component.css']
})
export class VmsStudentsComponent implements OnInit, OnDestroy {
  columnsToDisplay: string[] = ['id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize', 'accensione', 'modifica', 'elimina'];
  dataSource: Vm[];
  courseName: string;
  vmConfig: VmConfig = new VmConfig(-1, -1, '', 0, 0, 0, 0, 0);
  sub: Subscription;
  team: Team = new Team(-1, '', '');


  constructor(
      private courseService: CourseService,
      private dialog: MatDialog,
      private snackBar: MatSnackBar,
      private teamService: TeamService,
      private route: ActivatedRoute) {
    this.dataSource = vmsTest;
    this.sub = this.route.parent.params.subscribe(params => {
      this.getTeamId(params.name);
      this.courseName = params.name;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
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

  openCreateVm(){
    // todo: unsubrscribe?
    if (this.team.id === -1){
      this.snackBar.open('Si sono verificati problemi nel recuperare il team.', 'Chiudi');
      return;
    }
    if ((this.vmConfig.maxVm - this.vmNumber()) < 1) {
      this.snackBar.open('Massimo numero VMs raggiunto.', 'Chiudi');
      return;
    }
    const vmConfigLeft = new VmConfig(
        undefined,
        this.team.id,
        this.team.name,
        this.vmConfig.maxCpu - this.cpu(),
        this.vmConfig.maxRam - this.ram(),
        this.vmConfig.maxDisk - this.disk(),
        this.vmConfig.maxVm - this.vmNumber(),
        this.vmConfig.maxActive - this.active());
    console.log(vmConfigLeft);
    // todo: unsubscribe
    const d = {config: vmConfigLeft, courseName: this.courseName};
    const dialogRef = this.dialog.open(CreateVmDialogComponent, {data: d});
    dialogRef.afterClosed().subscribe(() => {
      this.getVmsInstances(this.courseName, this.team.id);
    });
  }

  getTeamId(courseName: string){
    this.teamService.getTeamsByStudent(courseName)
        .subscribe(data => {
          data.forEach(d => {
            if (d.status === 'ACTIVE'){
              console.log(d);
              this.team = d;
              this.getVmConfig(courseName, d.id, d.name);
              this.getVmsInstances(courseName, d.id);
            }
          },
          error => console.log(error));
        });
  }

  getVmConfig(courseName: string, teamId: number, teamName: string){
    this.courseService.getTeamVMConfig(courseName, teamId, teamName)
        .subscribe(
            data => {
              console.log(data);
              this.vmConfig = data;
            },
            error => console.log(error)
            );
  }

  getVmsInstances(courseName: string, teamId: number){
    this.courseService.getTeamVMs(courseName, teamId)
        .subscribe(
            data => this.dataSource = data,
            error => console.log(error)
        );
  }
}


const vmsTest: Vm[] = [
  new Vm(0, true, 10, 32, 200),
  new Vm(1, false, 4, 10, 20),
];

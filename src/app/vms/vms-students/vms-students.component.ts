import {Component, OnDestroy, OnInit} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {Team} from '../../models/team.model';
import {TeamService} from '../../services/team.service';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {VmConfig} from '../../models/vm.config.model';
import {CourseService} from '../../services/course.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateVmDialogComponent} from '../create-vm-dialog/create-vm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ShareVmDialogComponent} from '../share-vm-dialog/share-vm-dialog.component';
import {Student} from '../../models/student.model';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-vms-students',
  templateUrl: './vms-students.component.html',
  styleUrls: ['./vms-students.component.css']
})
export class VmsStudentsComponent implements OnInit, OnDestroy {
  columnsToDisplay: string[] = ['id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize', 'accensione', 'modifica', 'share', 'elimina'];
  dataSource: Vm[];
  courseName: string;
  vmConfig: VmConfig = new VmConfig(-1, -1, '', 0, 0, 0, 0, 0);
  sub: Subscription;
  team: Team = new Team(-1, '', '');
  owners: Array<Array<Student>> = [];

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private teamService: TeamService,
    private route: ActivatedRoute) {
    this.dataSource = [];
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


  deleteVm(vm: Vm){
    this.courseService.deleteVmInstance(this.courseName, this.team.id, vm)
      .subscribe(
        () => this.dataSource = this.dataSource.filter(e => e.id !== vm.id),
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore.', 'Chiudi');
          this.getVmsInstances(this.courseName, this.team.id);
        }
      );
  }

  editVm(vm: Vm){
    const vmConfigLeft = new VmConfig(
      undefined,
      this.team.id,
      this.team.name,
      this.vmConfig.maxCpu - this.cpu() + vm.cpu,
      this.vmConfig.maxRam - this.ram() + vm.ramSize,
      this.vmConfig.maxDisk - this.disk() + vm.diskSize,
      this.vmConfig.maxVm - this.vmNumber() + 1,
      0);
    // todo: unsubscribe
    const d = {config: vmConfigLeft, courseName: this.courseName, edit: true, vm};
    const dialogRef = this.dialog.open(CreateVmDialogComponent, {data: d});
    dialogRef.afterClosed().subscribe(() => {
      this.getVmsInstances(this.courseName, this.team.id);
    });
  }

  switchState(vm: Vm){
    const i = this.dataSource.findIndex(e => e.id === vm.id);
    this.dataSource[i].active = !vm.active;
    console.log(this.dataSource);
  }

  startOrStopVm(vm: Vm){
    let request;
    if (vm.active) {
      console.log('Stop vm ' + vm.id);
      request = this.courseService.powerOff(this.courseName, this.team.id, vm);
    }
    else {
      console.log('Start vm ' + vm.id);
      if (this.vmConfig.maxActive - this.active() < 1){
        this.snackBar.open('Numero masimo di VM attive raggiunto.', 'Chiudi');
        return;
      }
      this.switchState(vm);
      request = this.courseService.powerOff(this.courseName, this.team.id, vm);
    }
    request.subscribe(
      () => this.switchState(vm),
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore.', 'Chiudi');
        this.getVmsInstances(this.courseName, this.team.id);
      }
    );

  }

  openCreateVm(){
    // todo: unsubrscribe?
    if (this.team.id === -1){
      this.snackBar.open('Si sono verificati problemi nel recuperare il team.', 'Chiudi');
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
      0);
    if (vmConfigLeft.maxVm === 0 || vmConfigLeft.maxCpu === 0 || vmConfigLeft.maxRam === 0 ||
      vmConfigLeft.maxDisk === 0) {
      this.snackBar.open('Massimo numero risorse raggiunto.', 'Chiudi');
      return;
    }
    const vm: Vm = new Vm(undefined, false, 0, 0, 0);
    // console.log(vmConfigLeft);
    // todo: unsubscribe
    const d = {config: vmConfigLeft, courseName: this.courseName, edit: false, vm};
    const dialogRef = this.dialog.open(CreateVmDialogComponent, {data: d});
    dialogRef.afterClosed().subscribe(() => {
      this.getVmsInstances(this.courseName, this.team.id);
    });
  }

  shareVm(vm: Vm){
    // console.log(vmConfigLeft);
    // todo: unsubscribe
    const d = {teamId: this.team.id, courseName: this.courseName, vmId: vm.id};
    const dialogRef = this.dialog.open(ShareVmDialogComponent, {data: d});
    // dialogRef.afterClosed().subscribe(() => {
    //   this.getVmsInstances(this.courseName, this.team.id);
    // });
  }

  getTeamId(courseName: string){
    this.teamService.getTeamsByStudent(courseName)
      .subscribe(data => {
        data.forEach(d => {
            if (d.status === 'ACTIVE'){
              // console.log(d);
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
          // console.log(data);
          this.vmConfig = data;
        },
        error => console.log(error)
      );
  }

  getVmsInstances(courseName: string, teamId: number){
    this.courseService.getTeamVMs(courseName, teamId)
      .subscribe(
        data => {
          data.forEach(e => this.getOwners(courseName, teamId, e.id));
          this.dataSource = data;
        },
        error => console.log(error)
      );
  }

  getOwners(courseName: string, teamId: number, vmId: number){
    this.owners[vmId] = [];
    this.courseService.getOwners(courseName, teamId, vmId)
      .subscribe(
        data => this.owners[vmId] = data,
        error => console.log(error)
      );
  }

  isOwner(vm: Vm){
    const id = this.authService.getId();
    return this.owners[vm.id].findIndex(e => e.id === id) !== -1;
  }
}

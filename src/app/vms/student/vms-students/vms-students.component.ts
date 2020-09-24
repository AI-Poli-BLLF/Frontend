import {Component, OnDestroy, OnInit} from '@angular/core';
import {Vm} from '../../../models/vm.model';
import {Team} from '../../../models/team.model';
import {TeamService} from '../../../services/team.service';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {VmConfig} from '../../../models/vm.config.model';
import {CourseService} from '../../../services/course.service';
import {MatDialog} from '@angular/material/dialog';
import {CreateVmDialogComponent} from '../create-vm-dialog/create-vm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ShareDialogComponent} from '../../../teacher/share-dialog/share-dialog.component';
import {Student} from '../../../models/student.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-vms-students',
  templateUrl: './vms-students.component.html',
  styleUrls: ['./vms-students.component.css']
})
// componente che si occupa di mostrare le vm disponibili per uno studente
// e le risorse occupate dalle vm del gruppo
// inoltre permette di creare vm
export class VmsStudentsComponent implements OnInit, OnDestroy {
  columnsToDisplay: string[] = [
    'id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize', 'accensione', 'modifica', 'share', 'elimina', 'link'
  ];
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

  // questi metodi servono per calcolare le risorse auttualmente usate
  cpu(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.cpu);
    return sum;
  }
  // questi metodi servono per calcolare le risorse auttualmente usate
  ram(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.ramSize);
    return sum;
  }
  // questi metodi servono per calcolare le risorse auttualmente usate
  disk(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.diskSize);
    return sum;
  }
  // questi metodi servono per calcolare le risorse auttualmente usate
  active(){
    return this.dataSource.filter(vm => vm.active).length;
  }
  // questi metodi servono per calcolare le risorse auttualmente usate
  vmNumber(){
    return this.dataSource.length;
  }

  // metodo per eliminare una vm, effettua la richiesta tramite il service,
  // se va a buon fine filtra i risultati per escluderla senza richiedere i dati al service
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
  // per modificare una vm vengono passate le risorse disponibili
  // a cui vengono sottratte le risorse usate attualmente dalla vm che
  // si vuole modificare, alla dialog viene passato anche il parametro
  // edit=true per selezionare il service corretto
  // il component è lo stesso della create vm
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
    // todo: unsubscribe?
    const d = {config: vmConfigLeft, courseName: this.courseName, edit: true, vm};
    const dialogRef = this.dialog.open(CreateVmDialogComponent, {data: d});
    dialogRef.afterClosed().subscribe(() => {
      this.getVmsInstances(this.courseName, this.team.id);
    });
  }

  // funzione che cambia lo stato visualizzato
  switchState(vm: Vm){
    const i = this.dataSource.findIndex(e => e.id === vm.id);
    this.dataSource[i].active = !vm.active;
    // console.log(this.dataSource);
  }

  // metodo che permette di avviare o fermare una vm,
  // in base allo stato della vm viene accesa o spenta
  // e aggiorna il valore visualizzato senza richiedere i dati
  // mostra una snackbar di errore in caso di errore
  startOrStopVm(vm: Vm){
    let request;
    if (vm.active) {
      // console.log('Stop vm ' + vm.id);
      request = this.courseService.powerOff(this.courseName, this.team.id, vm);
    }
    else {
      // console.log('Start vm ' + vm.id);
      if (this.vmConfig.maxActive - this.active() < 1){
        this.snackBar.open('Numero masimo di VM attive raggiunto.', 'Chiudi');
        return;
      }
      request = this.courseService.wakeOnVm(this.courseName, this.team.id, vm);
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

  // per creare una vm vengono passate le risorse disponibili
  // alla dialog viene passato anche il parametro
  // edit=false per selezionare il service corretto
  // il component è lo stesso della edit vm
  openCreateVm(){
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
    // todo: unsubscribe ?
    const d = {config: vmConfigLeft, courseName: this.courseName, edit: false, vm};
    const dialogRef = this.dialog.open(CreateVmDialogComponent, {data: d});
    dialogRef.afterClosed().subscribe(() => {
      this.getVmsInstances(this.courseName, this.team.id);
    });
  }

  // shareVm(vm: Vm){
  //   const d = {teamId: this.team.id, courseName: this.courseName, vm};
  //   this.dialog.open(ShareDialogComponent, {data: d});
  //   // dialogRef.afterClosed().subscribe(() => {
  //   //   this.getVmsInstances(this.courseName, this.team.id);
  //   // });
  // }

  // metodo usato per capire se lo studente appartiene ad almeno un team
  // se lo studente non appartiene ad un team non viene mostrata la tabella delle vm
  // e non potrà crearne
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

  // permette di ottenere il creatore della vm
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

  getVmsInstances(courseName: string, teamId: number){
    this.courseService.getTeamVMs(courseName, teamId)
      .subscribe(
        data => {
          data.forEach(e => {
            this.getOwners(courseName, teamId, e.id);
            this.getCreator(courseName, teamId, e.id, e);
          });
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

  // metodo che permette di abilitare o disabilitare i tasti della vm,
  // se uno studente non è un owner non potrà accenderla o spegnerla
  isOwner(vm: Vm){
    const id = this.authService.getId();
    return this.owners[vm.id].findIndex(e => e.id === id) !== -1;
  }
}

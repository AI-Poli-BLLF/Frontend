import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Vm} from '../../../models/vm.model';
import {VmConfig} from '../../../models/vm.config.model';
import {CourseService} from '../../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-vm-sub-table',
  templateUrl: './vm-sub-table.component.html',
  styleUrls: ['./vm-sub-table.component.css']
})
// componente che mostra le vm del singolo gruppo una volta fatto click
// sulla configurazione del gruppo
// il componente mostra anche le risorse utilizzate dal team
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

  // somma tutte le risorse usate dalle vm di un team
  cpu(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.cpu);
    return sum;
  }
  // somma tutte le risorse usate dalle vm di un team
  ram(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.ramSize);
    return sum;
  }
  // somma tutte le risorse usate dalle vm di un team
  disk(){
    let sum = 0;
    this.dataSource.forEach(vm => sum += vm.diskSize);
    return sum;
  }
  // somma tutte le risorse usate dalle vm di un team
  active(){
    return this.dataSource.filter(vm => vm.active).length;
  }
  // somma tutte le risorse usate dalle vm di un team
  vmNumber(){
    return this.dataSource.length;
  }

  // permette di salvare la configurazione ottenuta dal VmEditResourcesComponent
  // alla ricezione dell'evento dal componente figlio invia al server la nuova configurazione
  // e a sua volta notifica al suo padre l'avvenuta modifica, permetendo di non ricaricare tutte le vms
  // in caso di errore lo segnala con una snackbar
  save(event: VmConfig){
    // console.log(event);
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
    // console.log('Get vms');
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
          // console.log(this.dataSource);
        },
        error => console.log(error)
      );
  }

  // inizializza la onfigurazione di una nuova vm da passare al VmEditResourcesComponent
  // e imposta un intervallo per aggiornare le vm e le proprie risorse usate in tempo reale
  ngOnInit(): void {
    this.dataSource = [];
    this.getVMs();
    this.interval = setInterval(() => this.getVMs(), 10000);
    this.vmConfigNew = new VmConfig(
      this.vmConfig.id, this.vmConfig.teamId, this.vmConfig.groupName,
      this.vmConfig.maxCpu, this.vmConfig.maxRam, this.vmConfig.maxDisk,
      this.vmConfig.maxVm, this.vmConfig.maxActive
    );
    // console.log(this.vmConfigNew);
  }
}

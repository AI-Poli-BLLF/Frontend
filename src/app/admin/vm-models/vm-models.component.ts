import { Component, OnInit } from '@angular/core';
import {VmModel} from '../../models/vm.model.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VmModelsList} from '../../models/vm.models.list.model';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../teacher/courses/delete-confirm-dialog/delete-confirm-dialog.component';
import {Course} from '../../models/course.model';
import {AddVmModelComponent} from '../add-vm-model/add-vm-model.component';
import {Vm} from '../../models/vm.model';
import {AddVmModelVersionsComponent} from '../add-vm-model-versions/add-vm-model-versions.component';
import {AdminService} from '../../services/admin.service';
import {Student} from '../../models/student.model';
import {forkJoin, Observable} from 'rxjs';
import {DeleteVersionComponent} from '../delete-version/delete-version.component';

@Component({
  selector: 'app-vm-models',
  templateUrl: './vm-models.component.html',
  styleUrls: ['./vm-models.component.css']
})
export class VmModelsComponent implements OnInit {
 vmModelsList: VmModelsList[] = [];
  constructor(
    private courseService: CourseService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  // ottengo tutti i modelli di vm disponibili sul backend,
  // se si verifica un errore apro una snackbar per segnalarlo
  getModels(){
    this.courseService.getAllVmModels()
      .subscribe(
        data => this.vmModelsList = data,
        error => {
          this.snackBar.open('Errore caricamento modelli vm', 'Chudi');
          this.vmModelsList = [];
          console.log(error);
        }
      );
  }

  ngOnInit(): void {
    this.getModels();
  }

  // la funzione add model apre una dialog per ricevere il nome del modello
  // e le versioni (possono anche essere un vettore vuoto)
  // e effettua la post sul backend, se la richiesta va a buon fine
  // l'elemento viene direttamente aggiunto senza richiedere i nuovamente i dati,
  // altrimenti vengono richiesti e segnalato l'errore
  addModel(){
    const dialogRef = this.dialog.open(AddVmModelComponent);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data.os !== undefined) {
          const vmModelsList = new VmModelsList(undefined, data.os, data.versions);
          this.adminService.addOs(vmModelsList)
            .subscribe(
              res => {
                const v = [...this.vmModelsList];
                v.push(res);
                this.vmModelsList = v;
              },
              error => {
                console.log(error);
                this.snackBar.open('Si è verificato un errore', 'Chiudi');
                this.getModels();
              }
            );
        }
      },
        error => console.log(error)
    );
  }

  // la funzione add version apre una dialog per ricevere le versioni da aggiungere
  // e effettua la post sul backend, se la richiesta va a buon fine
  // gli elementi vengono direttamente aggiunto senza richiedere i dati della la tabella,
  // altrimenti vengono riscaricati e segnalato l'errore
  addVersion(event: VmModelsList){
    const v = {data: {os: event.osName}};
    const dialogRef = this.dialog.open(AddVmModelVersionsComponent, v);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data.versions !== undefined) {
          const addObs: Array<Observable<VmModelsList>> = [];
          data.versions.forEach(version => addObs.push(this.adminService.addVersion(event.osName, version)));
          forkJoin(addObs).subscribe(
            () => {
              const versions = this.vmModelsList.find(os => os.osName === event.osName).versions;
              data.versions.forEach(version => versions.push(version));
            },
            error => {
              console.log(error);
              this.snackBar.open('Si è verificato un errore', 'Chiudi');
              this.getModels();
            }
          );
        }
      },
        error => console.log(error)
    );
  }

  // la funzione delete versions apre una dialog per ricevere le versioni da rimuovere (tramite una multi select)
  // e effettua la post sul backend, se la richiesta va a buon fine
  // gli elementi vengono direttamente eliminate filtrando quelle esistenti senza richiedere i dati,
  // altrimenti vengono ricaricati e segnalato l'errore
  deleteVersions(event: VmModelsList){
    const v = {data: {os: event.osName, versions: event.versions}};
    const dialogRef = this.dialog.open(DeleteVersionComponent, v);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data.versions !== undefined) {
          const delObs: Array<Observable<any>> = [];
          console.log(data.versions);
          data.versions.forEach(version => delObs.push(this.adminService.deleteVersion(event.osName, version)));
          forkJoin(delObs).subscribe(
            () => {
              this.vmModelsList.find(e => e.osName === event.osName).versions =
                this.vmModelsList.find(e => e.osName === event.osName).versions
                  .filter(version => data.versions.findIndex(e => e === version) === -1);
            },
            error => {
              console.log(error);
              this.snackBar.open('Si è verificato un errore', 'Chiudi');
              this.getModels();
            }
          );
        }
      },
        error => console.log(error)
    );
  }

  // la funzione elimina invia una delete dell'elemento da eliminare al server
  // se la richiesta va a buon fine filtra la lista rimuovendolo
  // altrimenti richiede la lista dei modelli al server
  deleteOs(event: VmModelsList) {
    this.adminService.deleteOs(event.osName)
      .subscribe(
        () => {
          this.vmModelsList = this.vmModelsList.filter(e => e.osName !== event.osName);
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore', 'Chiudi');
          this.getModels();
        }
      );
  }
}

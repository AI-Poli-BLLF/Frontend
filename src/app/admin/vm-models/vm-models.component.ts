import { Component, OnInit } from '@angular/core';
import {VmModel} from '../../models/vm.model.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VmModelsList} from '../../models/vm.models.list.model';
import {MatDialog} from "@angular/material/dialog";
import {DeleteConfirmDialogComponent} from "../../teacher/courses/delete-confirm-dialog/delete-confirm-dialog.component";
import {Course} from "../../models/course.model";
import {AddVmModelComponent} from "../add-vm-model/add-vm-model.component";
import {Vm} from "../../models/vm.model";
import {AddVmModelVersionsComponent} from "../add-vm-model-versions/add-vm-model-versions.component";
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

  addVersion(event: VmModelsList){
    const v = {data: {os: event.osName, versions: []}};
    const dialogRef = this.dialog.open(AddVmModelVersionsComponent, v);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data.versions !== undefined) {
          console.log('QUA');
          const addObs: Array<Observable<VmModelsList>> = [];
          console.log(data.versions);
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

import { Component, OnInit } from '@angular/core';
import {VmModel} from '../../models/vm.model.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VmModelsList} from '../../models/vm.models.list.model';
import {MatDialog} from "@angular/material/dialog";
import {DeleteConfirmDialogComponent} from "../../teacher-view/courses/delete-confirm-dialog/delete-confirm-dialog.component";
import {Course} from "../../models/course.model";
import {AddVmModelComponent} from "../../add-vm-model/add-vm-model.component";
import {Vm} from "../../models/vm.model";
import {AddVmModelVersionsComponent} from "../../add-vm-model-versions/add-vm-model-versions.component";

@Component({
  selector: 'app-vm-models',
  templateUrl: './vm-models.component.html',
  styleUrls: ['./vm-models.component.css']
})
export class VmModelsComponent implements OnInit {
 vmModelsList: VmModelsList[] = [];
  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
    courseService.getAllVmModels()
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
  }

  addModel(){
    const dialogRef = this.dialog.open(AddVmModelComponent);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data.os !== undefined) {
          const vmModelsList = new VmModelsList(undefined, data.os, data.versions);
          console.log(vmModelsList);
          alert('Da implementare il service');
          // todo: implementare service
        }
      },
        error => console.log(error)
    );
  }

  addVersion(event: VmModelsList){
    console.log(event);
    const v = {data: {os: event.osName, versions: event.versions}};
    const dialogRef = this.dialog.open(AddVmModelVersionsComponent, v);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined && data.os !== undefined) {
          const vmModelsList = new VmModelsList(event.id, event.osName, data.versions);
          console.log(vmModelsList);
          alert('Da implementare il service');
          // todo: implementare service
        }
      },
        error => console.log(error)
    );
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {Vm} from '../../../models/vm.model';
import {VmConfig} from '../../../models/vm.config.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../../services/course.service';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-vm-dialog',
  templateUrl: './create-vm-dialog.component.html',
  styleUrls: ['./create-vm-dialog.component.css']
})
// dialog usato dallo studente per creare una vm
// riceve in ingresso le risorse ancora disponibili così
// da impostare i limiti massimi dei mat sliders
// una volta verificato che le risorse che si tenta di
// assegnare non siano nulle, viene effettuata la post dal service
export class CreateVmDialogComponent {
  vm: Vm;
  vmConfig: VmConfig;
  courseName: string;
  errorValue = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private courseService: CourseService,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<CreateVmDialogComponent>,
              private authService: AuthService) {
    this.vmConfig = data.config;
    this.courseName = data.courseName;
    this.vm = data.vm;
  }

  create(){
    if (this.vm.cpu === 0 || this.vm.ramSize === 0 || this.vm.diskSize === 0){
      this.errorValue = 'I valori delle risorse non possono essere nulli';
      return;
    }
    const vmData = {studentId: this.authService.getId(), instance: this.vm};
    let request;
    let mex: string;
    if (this.data.edit){
      // console.log('edit vm');
      request = this.courseService.editVmInstance(this.courseName, this.vmConfig.teamId, vmData, this.vm.id);
      mex = 'Modifica VM riuscita.';
    }
    else {
      // console.log('crete vm');
      request = this.courseService.createVmInstance(this.courseName, this.vmConfig.teamId, vmData);
      mex = 'Creazione VM riuscita.';
    }
    request.subscribe(
      () => {
        this.snackBar.open(mex, 'Chiudi');
        this.dialogRef.close();
      },
      error => {
        this.snackBar.open('Si è verificato un errore durante la creazione o la modifica della VM.', 'Chiudi');
        console.log(error);
        this.dialogRef.close();
      }
    );
  }

  // permette di aggiungere l'eticchetta GB/MB alla label/ mat slider
  formatLabel(value: number) {
    // console.log(value);
    if (value >= 1024) {
      return Math.round(value / 102.4) / 10 + 'GB';
    } else{ return value + 'MB'; }
  }

  // permette di aggiungere l'eticchetta GB/MB alla label/ mat slider
  diskLabel(value: number){
    return value + 'GB';
  }

}

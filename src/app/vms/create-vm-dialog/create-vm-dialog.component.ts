import {Component, Inject, OnInit} from '@angular/core';
import {Vm} from '../../models/vm.model';
import {VmConfig} from '../../models/vm.config.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../../models/course.model';
import {CourseService} from "../../services/course.service";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginDialogComponent} from "../../login-dialog/login-dialog.component";

@Component({
  selector: 'app-create-vm-dialog',
  templateUrl: './create-vm-dialog.component.html',
  styleUrls: ['./create-vm-dialog.component.css']
})
export class CreateVmDialogComponent implements OnInit {
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
  }

  ngOnInit(): void {
    this.vm = new Vm(undefined, false, 0, 0, 0);
  }

  create(){
    if (this.vm.cpu === 0 || this.vm.ramSize === 0 || this.vm.diskSize === 0){
      this.errorValue = 'I valori delle risorse non possono essere nulli';
      return;
    }
    const vmData = {studentId: this.authService.getId(), instance: this.vm};
    this.courseService.createVmInstance(this.courseName, this.vmConfig.teamId, vmData)
      .subscribe(
        data => {
          this.snackBar.open('Creazione VM riuscita.', 'Chiudi');
          this.dialogRef.close();
        },
        error => {
          this.snackBar.open('Si è verificato un errore durante la creazione della VM.', 'Chiudi');
          console.log(error);
          this.dialogRef.close();
        }
      );
  }

}

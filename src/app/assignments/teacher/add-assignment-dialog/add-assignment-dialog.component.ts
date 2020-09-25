import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AssignmentService} from '../../../services/assignment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../login/login-dialog/login-dialog.component';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Assignment} from '../../../models/assignment.model';

@Component({
  selector: 'app-add-assignment-dialog',
  templateUrl: './add-assignment-dialog.component.html',
  styleUrls: ['./add-assignment-dialog.component.css']
})
export class AddAssignmentDialogComponent implements OnInit {
  minDateR = new Date(Date.now());
  dataR = new FormControl(new Date());
  dataE = new FormControl(new Date());
  labelValue: string;
  courseName: string;
  formGroup: FormGroup;


  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private service: AssignmentService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.formGroup = this.fb.group({
      requiredFile: [undefined, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]/*,
      dataR: ['', [Validators.required]],
      dataE: ['', [Validators.required]]*/
    });

    this.courseName = data.courseName;
  }

  getNameErrorMessage() {
    if (this.formGroup.controls.name.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.name.hasError('minLength')
    || this.formGroup.controls.name.hasError('maxLength')
      ? 'Lunghezza nome non valida.' : '';
  }

  ngOnInit(): void {
  }

  add() {
    // todo: validare date cioè controllare che siano rimepite
    if (this.formGroup.invalid) {
      return;
    }
    const releaseDate = this.dataR.value;
    if (releaseDate === null ) {
      this.labelValue = 'Data di inizio non valida';
      return;
    }
    const expiryDate = this.dataE.value;
    if (expiryDate === null) {
      this.labelValue = 'Data di fine non valida';
      return;
    }
    if (expiryDate < releaseDate) {
      this.labelValue = 'Data di fine precedente a quella di inizio';
      return;
    }
    const file = this.formGroup.controls.requiredFile.value.files[0];
    const assignment = new Assignment(undefined, this.formGroup.controls.name.value, releaseDate, expiryDate);
    this.service.uploadAssignment(this.courseName, file, assignment).subscribe(
      data => {
        this.dialogRef.close(data);
      },
      error => {
        console.log(error);
        this.labelValue =
          (error.status === 401 || error.status === 403) ?
            'Utente non autorizzato' : 'Si è verificato un errore';
      }
    );
  }

  public checkError(controlName: string): boolean {
    return this.formGroup.controls[controlName].invalid;
  }


}

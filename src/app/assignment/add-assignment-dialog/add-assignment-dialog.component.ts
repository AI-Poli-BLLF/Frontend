import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AssignmentService} from '../../services/assignment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../login-dialog/login-dialog.component';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Assignment} from '../../models/assignment.model';

@Component({
  selector: 'app-add-assignment-dialog',
  templateUrl: './add-assignment-dialog.component.html',
  styleUrls: ['./add-assignment-dialog.component.css']
})
export class AddAssignmentDialogComponent implements OnInit {
  nameValidator = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  minDateR = new Date(Date.now());
  maxDateR = new Date(2021, 0, 1);
  minDateE = new Date(Date.now());
  maxDateE = new Date(2021, 0, 1);
  dataR = new FormControl(new Date());
  dataE = new FormControl(new Date());
  labelValue: string;
  courseName: string;


  constructor(
    private auth: AuthService,
    private service: AssignmentService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private route: ActivatedRoute
  ) {
    this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
    });
  }

  getNameErrorMessage() {
    if (this.nameValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.nameValidator.hasError('minLength') || this.nameValidator.hasError('maxLength')
      ? 'Lunghezza nome non valida.' : '';
  }

  ngOnInit(): void {
  }

  add() {
    if (this.nameValidator.invalid) {
      return;
    }
    const professorId = this.auth.getId();
    console.log(this.route);
    // this.route.params.subscribe(params => {
    //   this.courseName = params.name;
    // });
    const releaseDate = this.dataR.value;
    const expiryDate = this.dataE.value;
    const assignment = new Assignment(this.nameValidator.value, releaseDate, expiryDate);
    this.service.createAssignment(professorId, this.courseName, assignment).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
        this.labelValue =
          (error.status === 401 || error.status === 403) ?
            'Utente non autorizzato' : 'Si è verificato un errore';
      }
    );
    this.dialogRef.close();
  }
}

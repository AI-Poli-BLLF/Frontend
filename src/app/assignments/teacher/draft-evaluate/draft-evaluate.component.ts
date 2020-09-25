import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Assignment} from '../../../models/assignment.model';
import {AuthService} from '../../../services/auth.service';
import {AssignmentService} from '../../../services/assignment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../login/login-dialog/login-dialog.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-draft-evaluate',
  templateUrl: './draft-evaluate.component.html',
  styleUrls: ['./draft-evaluate.component.css']
})

// Dialog component per la valutazione di un elaborato
export class DraftEvaluateComponent implements OnInit {
  labelValue: string;
  courseName: string;
  draftId: number;
  assignmentId: number;
  formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private service: AssignmentService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.fb.group({
      requiredFile: [undefined, [Validators.required]],
      grade: ['', [Validators.required, Validators.min(1), Validators.max(33)]]
    });
    this.courseName = data.courseName;
    this.draftId = data.draftId;
    this.assignmentId = data.assignmentId;
  }

  getGradeErrorMessage() {
    if (this.formGroup.controls.grade.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.grade.hasError('min')
    || this.formGroup.controls.grade.hasError('max')
      ? 'Valore non valido.' : '';
  }

  ngOnInit(): void {
  }

  save() {
    if (this.formGroup.invalid) {
      return;
    }
    const professorId = this.auth.getId();
    const file = this.formGroup.controls.requiredFile.value.files[0];
    const grade = this.formGroup.controls.grade.value;
    this.service.uploadGradeAndCorrection(this.courseName, this.assignmentId, this.draftId, file, grade).subscribe(
      data => {
        this.dialogRef.close({grade});
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

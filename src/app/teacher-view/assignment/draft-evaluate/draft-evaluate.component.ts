import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Assignment} from '../../../models/assignment.model';
import {AuthService} from '../../../services/auth.service';
import {AssignmentService} from '../../../services/assignment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../login-dialog/login-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {Draft} from '../../../models/draft.model';

@Component({
  selector: 'app-draft-evaluate',
  templateUrl: './draft-evaluate.component.html',
  styleUrls: ['./draft-evaluate.component.css']
})
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
      grade: ['', [Validators.required, Validators.min(0), Validators.max(33)]]
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
    const file = this.formGroup.controls.requiredFile.value;
    const draft = new Draft(this.draftId, undefined, this.formGroup.controls.grade.value, undefined, undefined);
    this.service.uploadGradeAndCorrection(professorId, this.courseName, this.assignmentId, this.draftId, file, draft).subscribe(
      data => {
        this.dialogRef.close({data});
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

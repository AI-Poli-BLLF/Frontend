import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-vm-model-versions',
  templateUrl: './add-vm-model-versions.component.html',
  styleUrls: ['./add-vm-model-versions.component.css']
})
export class AddVmModelVersionsComponent implements OnInit {
  labelValue: string;
  formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddVmModelVersionsComponent>) {
    const versions = data.versions.reduce((prev, next, i) => prev + (i !== 0 ? ',' : '') + next, '');
    this.formGroup = fb.group({
      versions: [versions, [Validators.maxLength(255)]]
    });
  }

  public checkError(controlName: string): boolean {
    return this.formGroup.controls[controlName].invalid;
  }

  getVersionsErrorMessage() {
    return this.formGroup.controls.versions.hasError('maxlength')
      ? 'Lunghezza versioni del sistema operativo non valida.' : '';
  }

  ngOnInit(): void {
  }

  save() {
    const versions = this.formGroup.controls.versions.value.split(',');
    this.dialogRef.close({versions});
  }
}

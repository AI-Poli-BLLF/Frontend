import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-vm-model',
  templateUrl: './add-vm-model.component.html',
  styleUrls: ['./add-vm-model.component.css']
})
export class AddVmModelComponent implements OnInit {
  labelValue: string;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddVmModelComponent>) {
    this.formGroup = fb.group({
      os: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      versions: ['', [Validators.maxLength(255)]]
    });
  }
  public checkError(controlName: string): boolean {
    return this.formGroup.controls[controlName].invalid;
  }

  getOsErrorMessage() {
    if (this.formGroup.controls.os.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.os.hasError('minlength')
    || this.formGroup.controls.os.hasError('maxlength')
      ? 'Lunghezza del nome del sistema operativo non valida.' : '';
  }

  getVersionsErrorMessage() {
    return this.formGroup.controls.versions.hasError('maxlength')
      ? 'Lunghezza versioni del sistema operativo non valida.' : '';
  }

  ngOnInit(): void {
  }

  add() {
    if (this.formGroup.invalid) {
      return;
    }
    const os = this.formGroup.controls.os.value;
    const versions = this.formGroup.controls.versions.value.split(',');
    this.dialogRef.close({os, versions});
  }
}

import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.css']
})
export class AddCourseDialogComponent implements OnInit {
  nameValidator = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  minValidator = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000)]);
  maxValidator = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000)]);
  labelValue: string;

  constructor() { }

  getNameErrorMessage() {
    if (this.nameValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.nameValidator.hasError('minLength') || this.nameValidator.hasError('maxLength')
      ? 'Lunghezza nome non valida.' : '';
  }

  getMinErrorMessage() {
    if (this.minValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.minValidator.hasError('min') || this.minValidator.hasError('max')
      ? 'Valore non consentito.' : '';
  }

  getMaxErrorMessage() {
    if (this.maxValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.maxValidator.hasError('min') || this.maxValidator.hasError('max')
      ? 'Valore non consentito.' : '';
  }

  // todo: il max deve essere maggiore del min

  add(){
  }


  ngOnInit(): void {
  }

}

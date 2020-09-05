import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Course} from '../models/course.model';
import {CourseService} from '../services/course.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';

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

  constructor(private service: CourseService, private dialogRef: MatDialogRef<LoginDialogComponent>) { }

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
    // todo: opzione per modificare l'enabled
    const course: Course = new Course(this.nameValidator.value, true, this.minValidator.value, this.maxValidator.value);
    console.log(JSON.stringify(course));
    this.service.update(course).subscribe(
      data => {
        console.log(data);
        this.dialogRef.close();
      },
      error => {
        console.log(error);
        (error.status === 401 || error.status === 403) ?
          this.labelValue = 'Utente non autorizzato' : this.labelValue = 'Si è verificato un errore';
      }

    );
  }


  ngOnInit(): void {
  }

}

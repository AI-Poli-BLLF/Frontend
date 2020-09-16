import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../login-dialog/login-dialog.component';
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent implements OnInit {
  nameValidator = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  minValidator = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000)]);
  maxValidator = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000)]);
  labelValue: string;
  course: Course;

  ngOnInit(): void {
  }
  changed(event){
    this.course.enabled = event.checked;
  }
  constructor(private service: CourseService,
              private dialogRef: MatDialogRef<LoginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Course) {
    this.course = data;
  }

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
  // todo: aggiungere modello e versione
  edit(){
    if (
      this.nameValidator.invalid ||
      this.minValidator.invalid ||
      this.maxValidator.invalid
    ) {
      return;
    }
    const course: Course = new Course(this.nameValidator.value, this.course.enabled, this.minValidator.value, this.maxValidator.value);
    console.log(JSON.stringify(course));
    this.service.update(course).subscribe(
      data => {
        console.log(data);
        this.dialogRef.close(this.course.enabled);
      },
      error => {
        console.log(error);
        (error.status === 401 || error.status === 403) ?
          this.labelValue = 'Utente non autorizzato' : this.labelValue = 'Si è verificato un errore';
      }
    );
  }
}

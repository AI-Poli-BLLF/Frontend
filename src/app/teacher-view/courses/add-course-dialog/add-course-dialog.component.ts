import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../../models/course.model';
import {CourseService} from '../../../services/course.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../login-dialog/login-dialog.component';
import {VmModel} from '../../../models/vm.model.model';
import {AuthService} from '../../../services/auth.service';
import {VmModelsList} from '../../../models/vm.models.list.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.css']
})
export class AddCourseDialogComponent implements OnDestroy{
  checked = false;
  labelValue: string;
  formGroup: FormGroup;

  subMax: Subscription;
  subMin: Subscription;

  osV: VmModelsList[] = [];

  constructor(private service: CourseService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<LoginDialogComponent>,
              private authService: AuthService) {
    this.service.getVmModels()
      .subscribe(
        data => this.osV = data,
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel recuperare i modelli di VM', 'Chiudi');
        });
    this.formGroup = fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      min: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      max: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      os: ['', [Validators.required]],
      version: ['', [Validators.required]]
    });

    this.subMax = this.formGroup.controls.max.valueChanges.subscribe(() => this.changeMax());
    this.subMin = this.formGroup.controls.min.valueChanges.subscribe(() => this.changeMin());
  }

  ngOnDestroy() {
    this.subMax.unsubscribe();
    this.subMin.unsubscribe();
  }

  changed(event){
    this.checked = event.checked;
  }

  changeMin(){
    this.formGroup.controls.max.setValidators([
      Validators.required,
      Validators.min(parseInt(this.formGroup.controls.min.value, 10)),
      Validators.max(50)
    ]);
    this.subMax.unsubscribe();
    this.formGroup.controls.max.updateValueAndValidity();
    this.subMax = this.formGroup.controls.max.valueChanges.subscribe(() => this.changeMax());
  }

  changeMax(){
    this.formGroup.controls.min.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(parseInt(this.formGroup.controls.max.value, 10))
    ]);
    this.subMin.unsubscribe();
    this.formGroup.controls.min.updateValueAndValidity();
    this.subMin = this.formGroup.controls.min.valueChanges.subscribe(() => this.changeMin());
  }

  getOs(){
    const os: string[] = [];
    this.osV.forEach(o => os.push(o.osName));
    return os;
  }

  public checkError(controlName: string): boolean {
    return this.formGroup.controls[controlName].invalid;
  }

  getVersions(){
    const vmModelsList: VmModelsList = this.osV.find(o => o.osName === this.formGroup.controls.os.value);
    const v: string[] = vmModelsList == null ? [] : vmModelsList.versions;
    return v.sort();
  }

  getNameErrorMessage() {
    if (this.formGroup.controls.name.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.name.hasError('minlength') || this.formGroup.controls.name.hasError('maxlength')
      ? 'Lunghezza nome non valida.' : '';
  }

  getMinErrorMessage() {
    if (this.formGroup.controls.min.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.min.hasError('min') || this.formGroup.controls.min.hasError('max')
      ? 'Valore non consentito.' : '';
  }

  getMaxErrorMessage() {
    if (this.formGroup.controls.max.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.max.hasError('min') || this.formGroup.controls.max.hasError('max')
      ? 'Valore non consentito.' : '';
  }

  add(){
    // controllo se ci sono errori
    if (this.formGroup.invalid) { return; }
    this.service.addCourse(
      new Course(
        this.formGroup.controls.name.value,
        this.checked,
        this.formGroup.controls.min.value,
        this.formGroup.controls.max.value),
      new VmModel(undefined, this.formGroup.controls.os.value, this.formGroup.controls.version.value),
      this.authService.getId()
    ).subscribe(
      data => {
        console.log(data);
        this.dialogRef.close();
      },
      error => {
        console.log(error);
        this.labelValue =
          (error.status === 401 || error.status === 403) ?
          'Utente non autorizzato' :  'Si è verificato un errore';
      }
    );
  }

}

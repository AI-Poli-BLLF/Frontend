import {Component, Inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../../services/course.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../login/login-dialog/login-dialog.component';
import {Course} from '../../../models/course.model';
import {Subscription} from 'rxjs';
import {VmModelsList} from '../../../models/vm.models.list.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VmModel} from '../../../models/vm.model.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent implements OnDestroy {
  labelValue: string;
  checked: boolean;
  course: Course;
  formGroup: FormGroup;
  subMax: Subscription;
  subMin: Subscription;

  osV: VmModelsList[] = [];

  constructor(private service: CourseService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private dialogRef: MatDialogRef<LoginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.course = data.course;
    const vmModel: VmModel = data.vmModel;
    console.log(data);
    this.checked = this.course.enabled;
    this.service.getVmModels()
      .subscribe(
        osV => this.osV = osV,
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel recuperare i modelli di VM', 'Chiudi');
        });
    this.formGroup = fb.group({
      // name: [this.course.name, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      min: ['' + this.course.min, [Validators.required, Validators.min(1), Validators.max(50)]],
      max: ['' + this.course.max, [Validators.required, Validators.min(1), Validators.max(50)]],
      os: [vmModel.os, [Validators.required]],
      version: [vmModel.version, [Validators.required]]
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

  // getNameErrorMessage() {
  //   if (this.formGroup.controls.name.hasError('required')) {
  //     return 'Devi inserire un valore.';
  //   }
  //   return this.formGroup.controls.name.hasError('minlength') || this.formGroup.controls.name.hasError('maxlength')
  //     ? 'Lunghezza nome non valida.' : '';
  // }

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

  edit(){
    if (this.formGroup.invalid) { return; }
    const newCourse: Course =  new Course(
      this.course.name,
      this.checked,
      this.formGroup.controls.min.value,
      this.formGroup.controls.max.value,
      undefined);
    const vmModel: VmModel = new VmModel(
      undefined,
      this.formGroup.controls.os.value,
      this.formGroup.controls.version.value);
    console.log(newCourse);
    this.service.editCourse(this.course.name, newCourse, vmModel, this.authService.getId())
      .subscribe(
        data => {
          // console.log(data);
          this.dialogRef.close(this.checked);
        },
        error => {
          console.log(error);
          (error.status === 401 || error.status === 403) ?
            this.labelValue = 'Utente non autorizzato' : this.labelValue = 'Si è verificato un errore';
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../models/course.model';
import {CourseService} from '../../services/course.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../login-dialog/login-dialog.component';
import {VmModel} from '../../models/vm.model.model';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.css']
})
export class AddCourseDialogComponent implements OnInit {
  // todo: gestione form control sbagliata
  nameValidator = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  minValidator = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000)]);
  maxValidator = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000)]);
  selectedOs = new FormControl('', [Validators.required]);
  selectedV = new FormControl('', [Validators.required]);
  enabled = false;
  labelValue: string;
  formGroup: FormGroup;

  osV: VmModel[] = [
    new VmModel(undefined, 'Windows', '10'),
    new VmModel(undefined, 'Windows', '7'),
    new VmModel(undefined, 'Windows', '8'),
    new VmModel(undefined, 'Ubuntu', '20.04'),
    new VmModel(undefined, 'Ubuntu', '19.10'),
    new VmModel(undefined, 'Ubuntu', '19.04'),
    new VmModel(undefined, 'MacOS', 'Catalina'),
    new VmModel(undefined, 'MacOS', 'Mojave'),
    new VmModel(undefined, 'MacOS', 'High Sierra'),
    new VmModel(undefined, 'Android', '9'),
    new VmModel(undefined, 'Android', '10'),
    new VmModel(undefined, 'Android', '11')
  ];

  constructor(private service: CourseService, private dialogRef: MatDialogRef<LoginDialogComponent>) { }

  getOs(){
    const os: string[] = [];
    this.osV.forEach(o => os.findIndex(oo => o.os === oo) === -1 ? os.push(o.os) : o);
    return os;
  }

  getVersions(){
    const v: string[] = [];
    this.osV.filter(o => o.os === this.selectedOs.value)
      .forEach(o => v.findIndex(oo => o.os === oo) === -1 ? v.push(o.version) : o);
    return v.sort();
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

  getOsErrorMessage() {
    if (this.selectedOs.hasError('required')) {
      return 'Devi inserire un valore.';
    }
  }

  getVersionErrorMessage() {
    if (this.selectedV.hasError('required')) {
      return 'Devi inserire un valore.';
    }
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
    // controllo se ci sono errori
    if (
      this.nameValidator.invalid ||
      this.minValidator.invalid ||
      this.selectedOs.invalid ||
      this.selectedV.invalid ||
      this.maxValidator.invalid
    ) {
      return;
    }
    const selectedV = this.selectedV.value;
    const selectedOS = this.selectedOs.value;
    // todo: opzione per modificare l'enabled
    const course: Course = new Course(this.nameValidator.value, true, this.minValidator.value, this.maxValidator.value);
    console.log(JSON.stringify(course));
    this.service.update(course).subscribe(
      data => {
        console.log(data);
        this.addModel(course, selectedOS, selectedV);
      },
      error => {
        console.log(error);
        this.labelValue =
          (error.status === 401 || error.status === 403) ?
          'Utente non autorizzato' :  'Si è verificato un errore';
      }

    );
  }

  addModel(course: Course, selectedOS: string, selectedV: string){
    console.log('Model: ', selectedOS, selectedV);
    this.service.addCourseVmModel(course.name, new VmModel(undefined, this.selectedOs.value, this.selectedV.value))
      .subscribe(
        data => {
          console.log(data);
          this.dialogRef.close();
        },
        // todo: non ho la più pallida idea di come gestire l'errore se si verifica
        error => console.log(error)
      );
  }

  ngOnInit(): void {
  }

}

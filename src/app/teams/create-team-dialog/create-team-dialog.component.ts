import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {map, startWith} from 'rxjs/operators';
import {TeamService} from '../../services/team.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent implements OnInit {

  form: FormGroup;
  teamName: string;
  timeout: number;
  nameControl = new FormControl();
  filteredOptions: Observable<Student[]>;
  options: Student[];
  selectedStudents: Student[];
  courseName: string;

  constructor(fb: FormBuilder, private service: TeamService,
              @Inject(MAT_DIALOG_DATA) courseName: string,
              private dialogRef: MatDialogRef<CreateTeamDialogComponent>) {
    this.courseName = courseName;
    this.selectedStudents = [];
    this.form = fb.group({
      teamName: [this.teamName, [Validators.required, Validators.minLength(3), Validators.maxLength(9)]],
      timeout: [this.timeout, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.service.getAvailableStudents(this.courseName).subscribe(
      obsData => {
        this.options = obsData;
      }
    );

    this.filteredOptions = this.nameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => {
          if (!this.options) {
            return [];
          } else if (name) {
            return this._filter(name);
          } else {
            return this.options.slice();
          }
        })
      );
  }

  private _filter(name: string): Student[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue)
      || option.firstName.toLowerCase().includes(filterValue));
  }

  displayFn(student: Student): string {
    if (student) {
      return student.name + ' ' + student.firstName + ' ' + student.id;
    } else {
      return '';
    }
  }

  selectStudent(student: Student) {
    const index = this.selectedStudents.findIndex(s => s.id === student.id);
    if (index === -1) {
      this.selectedStudents.push(student);
    } else {
      console.log('Student ' + student.id + ' already selected');
    }
  }

  deleteStudent(student: Student) {
    const index = this.selectedStudents.findIndex(s => s.id === student.id);
    if (index !== -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      console.log('DELETING NOT SELECTED STUDENT ' + student.id);
    }
  }

  submit() {
    if (this.form.valid) {
      const retValue = {
        teamName: this.form.value.teamName,
        timeout: this.form.value.timeout,
        members: this.selectedStudents
      };
      this.dialogRef.close(retValue);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  public checkError(controlName: string): boolean {
    return this.form.controls[controlName].invalid;
  }
}

import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Team} from '../../models/team.model';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {map, startWith} from 'rxjs/operators';
import {TeamService} from '../../services/team.service';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent implements OnInit {

  nameControl = new FormControl();
  filteredOptions: Observable<Student[]>;
  options: Student[];
  selectedStudents: Student[];

  constructor(private service: TeamService,
              private dialogRef: MatDialogRef<CreateTeamDialogComponent>) {
    this.selectedStudents = [];
  }

  ngOnInit(): void {
    this.service.getAvailableStudents('ai').subscribe(
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
    this.dialogRef.close(this.selectedStudents);
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

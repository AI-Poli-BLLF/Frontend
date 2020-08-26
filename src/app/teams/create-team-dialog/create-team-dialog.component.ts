import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Team} from '../../models/team.model';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent implements OnInit {
  labelValue: string;
  nameControl = new FormControl();
  filteredOptions: Observable<Student[]>;
  options: Student[];

  ngOnInit(): void {
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<CreateTeamDialogComponent>) {
    data.options$.subscribe(
      obsData => {
        console.log('Received available students');
        console.log(obsData);
        this.options = obsData;
      }
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
    // Probably nothing: quando si schiaccia aggiungi si può cercare di
    // leggere il campo di testo e mandare quello. Sennò c'è il rischio di
    // mandare informazioni vecchie (ad es. clicco su uno studente, cancello,
    // clicco aggiungi e viene aggiunto lo studente :/ )
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {map, startWith} from 'rxjs/operators';
import {TeamService} from '../../services/team.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../../models/course.model';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
// dialog è un dummy component che permette di creare un team
// impostando nome, timeout e una lista di studenti
// selezionati tramite una mat select multipla
// una volta verificate che le condizioni del team siano verificate
// il team viene passato al padre che effettua l'aggiunta sul server
export class CreateTeamDialogComponent implements OnInit {

  form: FormGroup;
  teamName: string;
  timeout: number;
  nameControl = new FormControl();
  filterControl = new FormControl();
  filteredOptions: Observable<Student[]>;
  options: Student[];
  selectedStudents: string[];
  course: Course;

  constructor(fb: FormBuilder, private service: TeamService,
              @Inject(MAT_DIALOG_DATA) data: any,
              private dialogRef: MatDialogRef<CreateTeamDialogComponent>) {
    this.selectedStudents = [];
    this.course = data.course;
    this.form = fb.group({
      teamName: [this.teamName, [Validators.required, Validators.minLength(3), Validators.maxLength(9)]],
      timeout: [this.timeout, [Validators.required, Validators.min(1)]],
      members: [this.selectedStudents, [Validators.minLength(this.course.min - 1),
        Validators.maxLength(this.course.max - 1)]]
    });
  }

  ngOnInit(): void {
    this.service.getAvailableStudents(this.course.name).subscribe(
      obsData => {
        this.options = obsData;
        this.filterControl.setValue('');
      }
    );

    this.filteredOptions = this.filterControl.valueChanges
      .pipe(
        startWith(''),
        map(name => {
          if (!this.options) {
            return [];
          } else if (name) {
            return this.filterFn(name);
          } else {
            return this.options.slice();
          }
        })
      );
  }

  displayFn(student: Student): string {
    if (student) {
      return student.name + ' ' + student.firstName;
    } else {
      return '';
    }
  }

  private filterFn(name: string): Student[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue)
      || option.firstName.toLowerCase().includes(filterValue)
      || this.selectedStudents.indexOf(option.id) > -1);
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    } else {
      this.form.markAllAsTouched();
      console.log('Form not valid');
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  public checkError(controlName: string): boolean {
    return this.form.controls[controlName].invalid;
  }

  onSelectionChange($event: MatSelectChange) {
    this.selectedStudents = $event.value;
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TeamService} from '../../services/team.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, startWith} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material/select';
import {CourseService} from "../../services/course.service";

@Component({
  selector: 'app-share-vm-dialog',
  templateUrl: './share-vm-dialog.component.html',
  styleUrls: ['./share-vm-dialog.component.css']
})
export class ShareVmDialogComponent implements OnInit {
  filteredOptions: Observable<Student[]>;
  filterControl = new FormControl();
  membersControl = new FormControl('', [Validators.required, Validators.min(1)]);
  options: Student[];
  members: string[];
  courseName: string;

  constructor(
    private teamService: TeamService,
    private courseService: CourseService,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ShareVmDialogComponent>
  ) {
    this.members = [];
    this.options = [];
  }

  refreshFilteredOptions(){
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

  ngOnInit(): void {
    this.teamService.getTeamMembers(this.data.courseName, this.data.teamId)
      .subscribe(
        data => {
          console.log('Members');
          console.log(data);
          this.options = data;
          this.refreshFilteredOptions();
        },
        error => {
          console.log(error);
          this.members = [];
        }
      );

    this.courseService.getOwners(this.data.courseName, this.data.teamId, this.data.vm.id)
      .subscribe(
        data => this.membersControl.setValue(data.map(e => e.id)),
        error => {
          console.log(error);
          this.membersControl.setValue([]);
        }
      );
  }

  private filterFn(name: string): Student[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue)
      || option.firstName.toLowerCase().includes(filterValue)
      || this.members.indexOf(option.id) > -1);
  }

  submit() {
    if (this.membersControl.valid) {
      this.courseService.shareVm(this.data.courseName, this.data.teamId, this.data.vm.id, this.membersControl.value)
        .subscribe(
          data => data,
          error => console.log(error)
          );
      console.log(this.membersControl.value);
      this.dialogRef.close();
    } else {
      console.log('Form not valid');
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }


  onSelectionChange($event: MatSelectChange) {
    this.members = $event.value;
  }
}

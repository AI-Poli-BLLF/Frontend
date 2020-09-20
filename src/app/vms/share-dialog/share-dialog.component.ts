import {Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, startWith} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-share-vm-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {
  filteredOptions: Observable<Student[]>;
  filterControl = new FormControl();
  membersControl = new FormControl('', [Validators.required, Validators.min(1)]);
  options: Student[];
  owners: string[];

  members: string[];
  courseName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ShareDialogComponent>
  ) {
    this.members = [];
    this.options = data.options;
    this.owners = data.owners;
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
    console.log('OnInit', this.owners);
    this.refreshFilteredOptions();
    this.membersControl.setValue(this.owners);
  }

  private filterFn(name: string): Student[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue)
      || option.firstName.toLowerCase().includes(filterValue)
      || this.members.indexOf(option.id) > -1);
  }

  submit() {
    if (this.membersControl.valid) {
      this.dialogRef.close({ok: true, data: this.membersControl.value});
    } else {
      console.log('Form not valid');
    }
  }

  onNoClick() {
    this.dialogRef.close({ok: false});
  }


  onSelectionChange($event: MatSelectChange) {
    this.members = $event.value;
  }
}

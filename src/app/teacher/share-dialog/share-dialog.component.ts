import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Student} from '../../models/student.model';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, startWith} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material/select';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-share-vm-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
// dummy component che si occupa di visualizzare gli studenti/professori possessori di una vm/corso
// e permette di selezionare studenti/professori da aggiungere
// tramite una textbox possiamo filtrare i risultati
export class ShareDialogComponent implements OnInit {
  filteredOptions: Observable<User[]>;
  filterControl = new FormControl();
  membersControl = new FormControl('', [Validators.required, Validators.min(1)]);
  // la classe user è una classe estesa dal professore e dallo studente
  options: User[];
  owners: string[];
  disabled: string[];

  members: string[];
  courseName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ShareDialogComponent>
  ) {
    this.members = [];
    this.disabled = data.disabled;
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
    // console.log('OnInit', this.owners);
    this.refreshFilteredOptions();
    this.membersControl.setValue(this.owners);
  }

  private filterFn(name: string): User[] {
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

  isDisabled(option: User) {
    return !(this.disabled.findIndex(e => e === option.id) === -1);
  }
}

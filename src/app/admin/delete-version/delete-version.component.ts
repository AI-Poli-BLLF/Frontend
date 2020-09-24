import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-version',
  templateUrl: './delete-version.component.html',
  styleUrls: ['./delete-version.component.css']
})
export class DeleteVersionComponent implements OnInit {
  elements = new FormControl();
  elementsList: string[];

  constructor(private dialogRef: MatDialogRef<DeleteVersionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.elementsList = data.versions;
  }

  ngOnInit(): void {
  }

  save() {
    const versions = this.elements.value;
    console.log(versions);
    this.dialogRef.close({versions});
  }
}

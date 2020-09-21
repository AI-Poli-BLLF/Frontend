import {Component, Inject, OnInit} from '@angular/core';
import {Route} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../../services/course.service';
import {LoginDialogComponent} from '../../../login-dialog/login-dialog.component';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.css']
})
export class DeleteConfirmDialogComponent implements OnInit {
  courseName: string;
  labelValue = '';

  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private service: CourseService) {
    this.courseName = data;
  }

  ngOnInit(): void {
  }

  deleteCourse() {
    this.service.deleteOne(this.courseName).subscribe(
      data => {
        // console.log(data);
        this.dialogRef.close();
      },
      error =>   error.status === 400 ?
        this.labelValue = 'Corso non trovato' : this.labelValue = 'Si è verificato un errore'
  );

  }
}

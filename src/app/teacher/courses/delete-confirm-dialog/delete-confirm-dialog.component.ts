import {Component, Inject, OnInit} from '@angular/core';
import {Route} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../../services/course.service';
import {LoginDialogComponent} from '../../../login/login-dialog/login-dialog.component';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.css']
})
// comportamento descritto nel padre
export class DeleteConfirmDialogComponent implements OnInit {
  courseName: string;
  labelValue = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.courseName = data;
  }

  ngOnInit(): void {
  }

}

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Team} from "../../models/team.model";

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent implements OnInit {
  labelValue: string;

  ngOnInit(): void {
  }

  constructor(private service: CourseService,
              private dialogRef: MatDialogRef<CreateTeamDialogComponent>) {
  }
}

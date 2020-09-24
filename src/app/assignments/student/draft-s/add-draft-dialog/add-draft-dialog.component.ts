import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {AssignmentService} from '../../../../services/assignment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../../../login/login-dialog/login-dialog.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-draft-dialog',
  templateUrl: './add-draft-dialog.component.html',
  styleUrls: ['./add-draft-dialog.component.css']
})
export class AddDraftDialogComponent implements OnInit {
  assignmentId: string;

  constructor(
    private auth: AuthService,
    private service: AssignmentService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private route: ActivatedRoute
  ) {
    this.route.parent.params.subscribe(params => {
      this.assignmentId = params.key;
    });
  }

  ngOnInit(): void {
  }

}

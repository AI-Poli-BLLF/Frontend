import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {Student} from '../models/student.model';
import {TeamService} from '../services/team.service';
import {MatDialog} from '@angular/material/dialog';
import {CourseService} from '../services/course.service';
import {ShareDialogComponent} from './share-dialog.component';
import {Vm} from '../models/vm.model';
import {Team} from '../models/team.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-vm-button',
  template: '<button (click)="getOwners()" [disabled]="disabled" mat-stroked-button><mat-icon>share</mat-icon></button>',
  styleUrls: []
})
export class ShareVmButtonComponent implements OnInit, OnDestroy {
  @Input()
  courseName: string;
  @Input()
  team: Team;
  @Input()
  vm: Vm;
  @Input()
  disabled = false;

  @Output()
  update = new EventEmitter();

  dialogRef: Subscription;
  options: Student[];

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private courseService: CourseService
  ) {
    this.options = [];
  }

  getOwners(){
    this.courseService.getOwners(this.courseName, this.team.id, this.vm.id)
      .subscribe(
        data => {
          const owners = data.map(e => e.id);
          this.shareVm(owners);
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore nel recupero dei proprietari', 'Chiudi');
        }
      );
  }

  shareVm(owners: string[]){
    const d = {
      text: `Condividi VM  ${this.vm.id}`,
      disabled: [this.vm.student.id],
      options: this.options,
      owners
    };
    this.dialogRef = this.dialog.open(ShareDialogComponent, {data: d})
      .afterClosed().subscribe(v => {
        if (v.ok){
          this.submit(v.data);
        }
        this.dialogRef.unsubscribe();
      });
  }
  ngOnDestroy(){
    if (this.dialogRef !== undefined){
      this.dialogRef.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.teamService.getTeamMembers(this.courseName, this.team.id)
      .subscribe(
        data => {
          this.options = data;
        },
        error => {
          console.log(error);
          this.options = [];
        }
      );
  }

  submit(values: string[]) {
    this.courseService.shareVm(this.courseName, this.team.id, this.vm.id, values)
      .subscribe(
        data => data,
        error => console.log(error)
      );
  }
}

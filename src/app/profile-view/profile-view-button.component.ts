import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProfileViewComponent} from './profile-view.component';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-profile-view-button',
  template: '<button *ngIf="authService.isLogged()" mat-button (click)="openProfile()"><mat-icon>settings</mat-icon></button>',
  styleUrls: []
})
export class ProfileViewButtonComponent{

  constructor(private dialog: MatDialog, public authService: AuthService) { }

  openProfile(){
    const dialogRef = this.dialog.open(ProfileViewComponent);
  }
}

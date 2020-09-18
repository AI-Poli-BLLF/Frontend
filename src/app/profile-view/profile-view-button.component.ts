import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProfileViewComponent} from './profile-view.component';
import {AuthService} from '../services/auth.service';
import {ProfileService} from "../services/profile.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-profile-view-button',
  template: '<div *ngIf="authService.isLogged()" class="open-button" (click)="openProfile()">' +
    '<img class="image-cropper-small" [src]="photoPath" alt="Profile"/></div>',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewButtonComponent{
  photoPath: SafeUrl;

  constructor(private dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private profileService: ProfileService,
              public authService: AuthService) {
    this.profileService.getPhoto(authService.getRole(), authService.getId())
      .subscribe(
        data => {
          const objectURL = URL.createObjectURL(data);
          this.photoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          console.log(error);
          this.photoPath = 'assets/img/default.png';
        }
      );
  }

  openProfile(){
    const dialogRef = this.dialog.open(ProfileViewComponent);
  }
}

import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProfileViewComponent} from './profile-view.component';
import {AuthService} from '../services/auth.service';
import {ProfileService} from '../services/profile.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile-view-button',
  template: '<div *ngIf="isVisible()" class="open-button" (click)="openProfile()">' +
    '<img class="image-cropper-small" [src]="photoPath" alt="Profile"/></div>',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewButtonComponent implements OnDestroy{
  photoPath: SafeUrl;
  dialogSub: Subscription;

  constructor(private dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private profileService: ProfileService,
              public authService: AuthService) {
    // this.getImage();
  }

  isVisible(){
    return this.authService.isLogged() && this.authService.getRole() !== 'ROLE_ADMIN';
  }

  ngOnDestroy(): void {
    this.dialogSub.unsubscribe();
  }

  public getImage(){
    this.profileService.getPhoto(this.authService.getRole(), this.authService.getId())
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
    this.dialogSub = this.dialog.open(ProfileViewComponent)
      .afterClosed().subscribe(() => this.getImage());
  }
}

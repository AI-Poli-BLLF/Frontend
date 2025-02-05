import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProfileViewComponent} from './profile-view.component';
import {AuthService} from '../services/auth.service';
import {ProfileService} from '../services/profile.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile-view-button',
  templateUrl: './profile-view-button.component.html',
  styleUrls: ['./profile-view.component.css']
})
// tasto che mi permette di aprire il dialog del progilo
// lo nascondo se non sono loggato o se sono un admin (gli admin non hano un profilo)
// il tasto è l'immagine del profilo dello studente
export class ProfileViewButtonComponent implements OnDestroy{
  photoPath: SafeUrl;
  dialogSub: Subscription;

  @Output()
  logoutEvent: EventEmitter<unknown>;

  constructor(private dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private profileService: ProfileService,
              public authService: AuthService) {
    if (this.isVisible()){
      this.getImage();
    }
    this.logoutEvent = new EventEmitter<unknown>();
  }

  isVisible(){
    return this.authService.isLogged() && this.authService.getRole() !== 'ROLE_ADMIN';
  }

  ngOnDestroy(): void {
    if (this.dialogSub !== undefined) {
      this.dialogSub.unsubscribe();
    }
  }

  public getImage(){
    if (!(this.authService.isLogged() && this.authService.getRole() !== 'ROLE_ADMIN')){
      this.photoPath = 'assets/img/default.png';
      return;
    }
    this.profileService.getPhoto(this.authService.getRole(), this.authService.getId())
      .subscribe(
        data => {
          // per ottenere l'url dell'immagine faccio come nel dialog del profilo
          // ottengo l'url dal blob e sanitizzo l'url che
          // altrimenti il tag [src] dell'immagine non accetterebbe
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

  logout(){
    this.logoutEvent.emit();
  }
}

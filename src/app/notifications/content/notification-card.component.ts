import {Attribute, Component, OnInit} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {AuthService} from '../../services/auth.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';


export enum NotificationType {STUDENT_ENROLLING, PROFESSOR_COOPERATION, RESPONSE}
@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {
  photoPath: SafeUrl;
  type: NotificationType;
  selected: boolean;

  constructor(@Attribute('type') type: NotificationType,
              private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              public authService: AuthService) {
    this.type = type;
  }

  ngOnInit(): void {
    this.getImage();
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

  areButtonsVisible() {
    return this.type == 0 || this.type == 1;
  }

  setSelected(b: boolean) {
    this.selected = b;
  }
}

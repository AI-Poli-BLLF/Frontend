import {Component, Input, OnInit} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {AuthService} from '../../services/auth.service';
import {DomSanitizer} from '@angular/platform-browser';
import {NotificationToken, NotificationType} from '../../models/notification-token.model';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {

  @Input()
  notification: NotificationToken;

  constructor(private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.getImage();
  }

  public getImage(){
    // todo: con getRole del auth service ottieni il ruolo di chi lo sta usando e se è admin crasha tutto
    this.profileService.getPhoto(this.getRole(this.notification.senderId), this.notification.senderId)
      .subscribe(
        data => {
          const objectURL = URL.createObjectURL(data);
          this.notification.photoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          console.log(error);
          this.notification.photoPath = 'assets/img/default.png';
        }
      );
  }

  getRole(sender: string){
    switch (sender[0]) {
      case 'd':
        return 'ROLE_PROFESSOR';
      case 's':
        return 'ROLE_STUDENT';
    }
  }

  areButtonsVisible() {
    return this.notification.type === NotificationType.STUDENT_ENROLLING ||
      this.notification.type === NotificationType.PROFESSOR_COOPERATION;
  }
}

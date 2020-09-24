import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output()
  private acceptRequestEvent: EventEmitter<NotificationToken>;
  @Output()
  private rejectRequestEvent: EventEmitter<NotificationToken>;
  @Output()
  private readNotificationEvent: EventEmitter<NotificationToken>;

  constructor(private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              public authService: AuthService) {
    this.acceptRequestEvent = new EventEmitter<NotificationToken>();
    this.rejectRequestEvent = new EventEmitter<NotificationToken>();
    this.readNotificationEvent = new EventEmitter<NotificationToken>();
  }

  ngOnInit(): void {
    this.getImage();
  }

  public getImage(){
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

  acceptRequest() {
    if (this.notification.type !== NotificationType.RESPONSE){
      this.acceptRequestEvent.emit(this.notification);
    }
  }

  rejectRequest() {
    if (this.notification.type !== NotificationType.RESPONSE){
      this.rejectRequestEvent.emit(this.notification);
    }
  }

  readRequest($event){
    if (this.notification.type !== NotificationType.RESPONSE && !this.notification.notificationRead){
      this.readNotificationEvent.emit(this.notification);
    }
    $event.stopPropagation();
  }

  readResponse(){
    if (this.notification.type === NotificationType.RESPONSE && !this.notification.notificationRead){
      this.readNotificationEvent.emit(this.notification);
    }
  }
}

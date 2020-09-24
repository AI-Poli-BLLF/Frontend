import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NotificationToken, NotificationType} from '../models/notification-token.model';
import {NotificationService} from '../services/notification.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.css']
})
export class NotificationsMenuComponent implements OnInit, OnDestroy {
  notifications: Array<NotificationToken>;
  interval;

  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private snackBar: MatSnackBar) {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.getNotifications();
    this.interval = setInterval(() => this.getNotifications(), 10000);
  }


  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  menuOpened(){
    console.log('Opened');
    clearInterval(this.interval);
  }

  menuClosed(){
    console.log('Closed');
    this.interval = setInterval(() => this.getNotifications(), 10000);
  }

  getNotifications(){
    this.notificationService.getNotification().subscribe(
      tokens => {
        this.notifications = tokens;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel recuperare le notifiche', 'Chiudi');
      });
  }

  isVisible() {
    return this.authService.isLogged();
  }

  getReadCount() {
    return this.notifications.filter(value => !value.notificationRead).length;
  }

  acceptRequest(notificationToken: NotificationToken) {
    const acceptMessage = notificationToken.type === NotificationType.STUDENT_ENROLLING ?
      `Lo studente è stato iscritto con successo al corso ${notificationToken.courseName}` :
      `Hai accettato di collaborare al corso ${notificationToken.courseName}`;

    this.notificationService.acceptRequest(notificationToken).subscribe(
      () => {
        this.notifications = this.notifications.filter(value => value.id !== notificationToken.id);
        this.snackBar.open(acceptMessage, 'Chiudi');
      },
      err => {
        console.log(err);
        this.snackBar.open('Si è verificato un errore durante l\'accettazione della richiesta', 'Chiudi');
      }
    );
  }

  readNotification(notificationToken: NotificationToken) {
    this.notificationService.readNotification(notificationToken).subscribe(
      () => {
        notificationToken.notificationRead = true;
        this.notifications = this.notifications.map(value => value);
      },
      err => {
        console.log(err);
      }
    );
  }

  rejectRequest(notificationToken: NotificationToken) {
    const rejectMessage = notificationToken.type === NotificationType.STUDENT_ENROLLING ?
      `La richiesta dello studente è stata rifiutata` :
      `Hai rifiutato di collaborare al corso ${notificationToken.courseName}`;

    this.notificationService.rejectRequest(notificationToken).subscribe(
      () => {
        this.notifications = this.notifications.filter(value => value.id !== notificationToken.id);
        this.snackBar.open(rejectMessage, 'Chiudi');
      },
      err => {
        console.log(err);
        this.snackBar.open('Si è verificato un errore durante il rifiuto della richiesta', 'Chiudi');
      }
    );
  }

}

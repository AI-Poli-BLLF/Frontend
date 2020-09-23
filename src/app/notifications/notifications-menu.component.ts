import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NotificationToken} from '../models/notification-token.model';
import {NotificationService} from '../services/notification.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.css']
})
export class NotificationsMenuComponent implements OnInit {
  notifications: Array<NotificationToken>;
  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private snackBar: MatSnackBar) {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.notificationService.getNotification().subscribe(
      tokens => {
      this.notifications = tokens;
      console.log(this.notifications);
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
    this.notificationService.acceptRequest(notificationToken).subscribe(
      () => {
        this.notifications = this.notifications.filter(value => value.id !== notificationToken.id);
        this.snackBar.open(`Hai accettato di collaborare al corso ${notificationToken.courseName}`, 'Chiudi');
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
    this.notificationService.rejectRequest(notificationToken).subscribe(
      () => {
        this.notifications = this.notifications.filter(value => value.id !== notificationToken.id);
        this.snackBar.open(`Hai rifiutato di collaborare al corso ${notificationToken.courseName}`, 'Chiudi');
      },
      err => {
        console.log(err);
        this.snackBar.open('Si è verificato un errore durante il rifiuto della richiesta', 'Chiudi');
      }
    );
  }
}

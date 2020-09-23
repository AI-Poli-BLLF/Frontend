import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NotificationToken, NotificationType} from '../models/notification-token.model';

@Component({
  selector: 'app-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.css']
})
export class NotificationsMenuComponent implements OnInit {
  notifications: Array<NotificationToken>;
  constructor(private authService: AuthService) {
    this.notifications = [
      new NotificationToken(
        '', 's267541', 'PDS', 'Lo studente Lorenzo Limoli (s267541) ha richiesto di essere iscritto al corso PDS',
        false, NotificationType.STUDENT_ENROLLING, '24 Set'
      ),
      new NotificationToken(
        '', 'd123456', 'AI', 'Il professor Gianpiero Cabodi (d123456) ha richiesto la tua cooperazione per il corso AI',
        false, NotificationType.PROFESSOR_COOPERATION, '23 Set'
      ),
      new NotificationToken(
        '', 'd123456', 'PDS', 'Il professor Gianpiero Cabodi (d123456) ha accettato di cooperare per il corso PDS',
        true, NotificationType.RESPONSE, '22 Set'
      )
    ];
  }

  ngOnInit(): void {
  }

  isVisible() {
    return this.authService.isLogged();
  }

  getReadCount() {
    return this.notifications.filter(value => !value.notificationRead).length;
  }
}

import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NotificationCardComponent, NotificationType} from './content/notification-card.component';

@Component({
  selector: 'app-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.css']
})
export class NotificationsMenuComponent implements OnInit {
  selected: number;
  constructor(private authService: AuthService) {
    this.selected = 0;
  }

  ngOnInit(): void {
  }

  isVisible() {
    return this.authService.isLogged();
  }
}

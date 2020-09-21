import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.css']
})
export class NotificationsMenuComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  isVisible() {
    return this.authService.isLogged();
  }
}

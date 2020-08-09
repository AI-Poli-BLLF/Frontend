import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-welcome',
  template: '<h2>Welcome!!</h2>',
  styleUrls: []
})
export class WelcomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    this.redirect();
  }

  redirect(){
    const role = this.authService.getRole();
    console.log('ROLE: ', role);
    switch (role) {
      case 'ROLE_PROFESSOR':
        this.router.navigate(['/teacher']);
        break;
    }
  }
}

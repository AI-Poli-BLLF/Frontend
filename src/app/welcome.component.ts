import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-welcome',
  template: '<h2>Benvenuto!!</h2>',
  styleUrls: []
})
// componente che una volta effettuato il login si occcupa di reindirizzare
// gli utenti secondo il prorpio ruolo all'url corretto
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
      case 'ROLE_STUDENT':
        this.router.navigate(['/student']);
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin']);
        break;
    }
  }
}

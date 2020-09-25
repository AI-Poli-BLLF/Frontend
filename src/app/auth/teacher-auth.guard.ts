import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  // solo chi ha ruolo professor può attivare certi percorsi
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!(this.authService.getRole() === 'ROLE_PROFESSOR')){
      this.router.navigate(['not-found']);
      return false;
    }
    return true;
  }
}

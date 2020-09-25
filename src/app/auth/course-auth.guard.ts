import {Injectable, OnInit} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, NavigationStart} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {TeamService} from '../services/team.service';
import {Course} from '../models/course.model';
import {CourseService} from '../services/course.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseAuthGuard implements CanActivate {
  courses: Course[];
  // durante la costruzione del componente mi scarico la lista di corsi a
  // cui lo studente è iscritto così da non dovere scaricare i corsi più volte
  // se il corso non è presente chiedo la lista al server e cambio la route in not found
  // se quello studente non è iscritto alla lista aggiornata di corsi
  // o il docente non è un possessore
  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router) {
    this.courses = [];
    this.getCourseObs().subscribe(
      data => this.courses = data,
      () => this.courses = []
    );
    console.log('CourseGuard');
  }
  // solo chi possiede il corso o è iscritto al corso può accedere alla route
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseName = next.params.name;
    if (this.courses.findIndex(c => c.name === courseName) !== -1){
      return true;
    }
    return this.getCourseObs().pipe(
      map(courses => {
        if (courses.findIndex(c => c.name === courseName) === -1){
          this.router.navigate(['not-found']);
          return false;
        }
        return true;
      })
    );
  }

  getCourseObs(){
    let obs: Observable<Course[]>;
    switch (this.authService.getRole()) {
      case 'ROLE_STUDENT':
        obs = this.courseService.getAllByStudent(this.authService.getId());
        break;
      case 'ROLE_PROFESSOR':
        obs = this.courseService.getAllByProfessor(this.authService.getId());
        break;
    }
    return obs;
  }


}

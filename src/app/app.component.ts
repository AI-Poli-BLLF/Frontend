import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {NavModel} from './nav.model';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';
import {Course} from './models/course.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'ai20-lab04';
  doLogin: Subscription;

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  @ViewChild(LoginDialogComponent)
  loginDialog: LoginDialogComponent;
  links: Array<NavModel> = [
    new NavModel('teacher/course/applicazioni-internet/students', 'Students'),
    new NavModel('teacher/course/applicazioni-internet/vms', 'VMs')
  ];
  courses: Array<Course> = [
    new Course('Aaaa', true, 10, 100),
    new Course('Bbbb', false, 10, 100),
    new Course('Cccc', true, 10, 100),
    new Course('Dddd', true, 10, 100),
  ];


  constructor(route: ActivatedRoute, private authService: AuthService) {
    this.doLogin = route.queryParams.subscribe(
      q =>
        (q.doLogin === 'true' && !authService.isLogged()) || (q.doLogin === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialog() : q);
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  ngOnDestroy(): void {
    this.doLogin.unsubscribe();
  }
}

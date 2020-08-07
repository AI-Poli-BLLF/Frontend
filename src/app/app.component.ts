import {Component, OnDestroy, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {LoginDialogComponent, LoginDialogContentComponent} from './login-dialog/login-dialog.component';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';
import {Course} from './models/course.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCourseDialogComponent} from './add-course-dialog/add-course-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'ai20-lab04';
  doLogin: Subscription;
  homeS: Subscription;

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  @ViewChild(LoginDialogComponent)
  loginDialog: LoginDialogComponent;

  courses: Array<Course> = [
    new Course('Aaaa', true, 10, 100),
    new Course('Bbbb', false, 10, 100),
    new Course('Cccc', true, 10, 100),
    new Course('Dddd', true, 10, 100),
  ];

  selectedItem = 'Seleziona un corso';
  editCourseOptions = true;
  editCourseName = false;

  constructor(route: ActivatedRoute, private authService: AuthService, private router: Router, private dialog: MatDialog) {
    // route.paramMap.subscribe(params => console.log(params.get()));

    this.homeS = router.events.subscribe(
      e => (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e
    );
    this.doLogin = route.queryParams.subscribe(
      q => {
        (q.doLogin === 'true' && !authService.isLogged()) || (q.doLogin === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialog() : q;
        (q.doReg === 'true' && !authService.isLogged()) || (q.doReg === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialogReg() : q;
      });
  }

  openAddCourseDialog(){
    const dialogRef = this.dialog.open(AddCourseDialogComponent);
  }

  startToEditCourseName(){
    this.editCourseOptions = false;
    this.editCourseName = true;
  }

  stopEditCourseName() {
    this.editCourseOptions = true;
    this.editCourseName = false;
  }

  handleClick(selectedItem: Course) {
    this.selectedItem = selectedItem.name;
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  ngOnDestroy(): void {
    this.doLogin.unsubscribe();
    this.homeS.unsubscribe();
  }

}

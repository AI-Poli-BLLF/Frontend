import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {LoginDialogComponent, LoginDialogContentComponent} from './login-dialog/login-dialog.component';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';
import {Course} from './models/course.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCourseDialogComponent} from './add-course-dialog/add-course-dialog.component';
import {CourseService} from "./services/course.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit{
  title = 'ai20-lab04';
  doLogin: Subscription;
  homeS: Subscription;

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  @ViewChild(LoginDialogComponent)
  loginDialog: LoginDialogComponent;

  courses: Array<Course> = [];

  selectedItem = 'Seleziona un corso';
  editCourseOptions = true;
  editCourseName = false;

  constructor(
    route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private courseService: CourseService) {
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

  ngOnInit(): void {
    this.loadCourses();
  }

  openAddCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(AddCourseDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.loadCourses();
    });
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

  loadCourses(){
    // todo: sarebbe più saggio visualizzare solo i corsi di quel prof
      this.courseService.getAll().subscribe(
        data => {
          console.log(data);
          this.courses = data;
        },
        error => console.log(error)
      );
  }
}

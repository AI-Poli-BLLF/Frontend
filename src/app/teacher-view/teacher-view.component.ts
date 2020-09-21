import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Course} from '../models/course.model';
import {AddCourseDialogComponent} from './courses/add-course-dialog/add-course-dialog.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {CourseService} from '../services/course.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {DeleteConfirmDialogComponent} from './courses/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditCourseDialogComponent} from './courses/edit-course-dialog/edit-course-dialog.component';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.css']
})
export class TeacherViewComponent implements OnInit, OnDestroy {
  homeS: Subscription;
  selectedItem: string;
  editCourseOptions = true;
  courses: Array<Course> = [];

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  constructor(private router: Router,
              private courseService: CourseService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private service: CourseService) {
    this.homeS = router.events.subscribe(
      e => (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e
    );
  }

  ngOnInit(): void {
    this.loadCourses();
    const courseName = this.route.firstChild.snapshot.params.name;
    this.selectedItem = courseName === undefined ? 'Seleziona un corso' : courseName;
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  openAddCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(AddCourseDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.loadCourses();
    });
  }

  snackBarDelete() {
    if (this.courses.findIndex(c => c.name === this.selectedItem) === -1) {
      this.snackBar.open('Corso cancellato', 'Chiudi');
      this.selectedItem = 'Seleziona un corso';
      this.router.navigate(['/teacher']);
    }
  }

  deleteCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
    dialogRef.afterClosed().subscribe(() => {
      this.service.getAll().subscribe(
        (data) => {
          this.courses = data;
          this.snackBarDelete();
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore', 'Chiudi');
        }
      );

    });
  }

  startToEditCourse(){
    const course: Course = this.courses.find(c => c.name === this.selectedItem);
    this.courseService.getCourseVmModel(course.name)
      .subscribe(
        vmModel => {
          const d = {course, vmModel};
          const dialogRef = this.dialog.open(EditCourseDialogComponent, {data: d});
          dialogRef.afterClosed().subscribe(data => {
            console.log(course.enabled, '!=', data);
            this.loadCourses();
            // tslint:disable-next-line:triple-equals
            if (!course.enabled == data) {
              this.selectedItem = 'Seleziona un corso';
              this.router.navigate(['/teacher']);
            }
          });
        },
        error => {
          console.log(error);
          this.snackBar.open('Impossibile caricare il modello della Vm.', 'Chiudi');
        }
      );
  }

  handleClick(selectedItem: Course) {
    this.selectedItem = selectedItem.name;
  }

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  loadCourses(){
    this.courseService.getAllByProfessor(this.authService.getId()).subscribe(
      data => {
        console.log(data);
        this.courses = data;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento dei corsi.', 'Chiudi');
      }
    );
  }


}

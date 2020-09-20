import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Course} from '../models/course.model';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CourseService} from '../services/course.service';
import {AuthService} from '../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddCourseDialogComponent} from '../teacher-view/add-course-dialog/add-course-dialog.component';
import {DeleteConfirmDialogComponent} from '../teacher-view/delete-confirm-dialog/delete-confirm-dialog.component';
import {EditCourseDialogComponent} from '../teacher-view/edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit, OnDestroy {
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
      e => {
        // tslint:disable-next-line:no-unused-expression
        (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e;
        // tslint:disable-next-line:no-unused-expression
        this.router.url.includes('/admin/tools') ? this.selectedItem = 'Admin Tools' : e;
      }
    );
  }

  ngOnInit(): void {
    this.loadCourses();
    const courseName = this.route.firstChild.snapshot.params.name;
    this.selectedItem = courseName === undefined ? 'Seleziona un corso' : courseName;
    // tslint:disable-next-line:no-unused-expression
    this.router.url.includes('/admin/tools') ? this.selectedItem = 'Admin Tools' : '';

  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  snackBarDelete() {
    if (this.courses.findIndex(c => c.name === this.selectedItem) === -1) {
      this.snackBar.open('Corso cancellato', 'Chiudi');
      this.selectedItem = 'Seleziona un corso';
      this.router.navigate(['/admin']);
    }
  }

  deleteCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
    dialogRef.afterClosed().subscribe(() => {
      this.service.getAll().subscribe(
        (data) => {
          this.courses = data.length > 0 ? data : [new Course('Nessun corso', false, 0, 0)] ;
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
              this.router.navigate(['/admin']);
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

  adminToolsClick() {
    this.selectedItem = 'Admin Tools';
  }

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  loadCourses(){
    this.courseService.getAll().subscribe(
      data => {
        console.log(data);
        this.courses = data.length > 0 ? data : [new Course('Nessun corso', false, 0, 0)] ;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento dei corsi.', 'Chiudi');
      }
    );
  }

}

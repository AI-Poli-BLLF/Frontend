import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Course} from '../models/course.model';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {CourseService} from '../services/course.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.css']
})
export class TeacherViewComponent implements OnInit, OnDestroy {
  homeS: Subscription;
  selectedItem: string;
  editCourseOptions = true;
  editCourseName = false;
  courses: Array<Course> = [];

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  constructor(private router: Router,
              private courseService: CourseService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private service: CourseService) {
    this.homeS = router.events.subscribe(
      e => (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e
    );
  }

  addCourse(course: Course){
    this.service.add(course).subscribe(
      data => {
        console.log(data);
        this.loadCourses();
      },
      error => {
        console.log(error);
        const mex = (error.status === 401 || error.status === 403) ?
          'Utente non autorizzato' : 'Si è verificato un errore';
        this.snackBar.open(mex);
      }

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

  undoSnackBar(course: Course){
    // todo: unsubrscribe?
    console.log(this.courses.findIndex(c => c.name === this.selectedItem) === -1);
    if (this.courses.findIndex(c => c.name === this.selectedItem) === -1){
      const snackBarRef = this.snackBar.open('Corso cancellato', 'Anulla');
      snackBarRef.afterDismissed().subscribe(d => {
        console.log(d.dismissedByAction);
        if (d.dismissedByAction){
          this.addCourse(course);
        }
        else {
          this.selectedItem = 'Seleziona un corso';
          this.router.navigate(['/teacher']);
        }
      });
    }
  }

  deleteCourseDialog(){
    // todo: unsubrscribe?
    const course: Course = this.courses.find(c => c.name === this.selectedItem);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
    dialogRef.afterClosed().subscribe(() => {
      this.service.getAll().subscribe(
        (data) => {
          this.courses = data;
          this.undoSnackBar(course);
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore', 'Chiudi')
        }
        );

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

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  loadCourses(){
    // todo: sarebbe più saggio visualizzare solo i corsi di quel prof
    this.courseService.getAll().subscribe(
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

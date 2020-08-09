import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Course} from '../models/course.model';
import {AddCourseDialogComponent} from '../add-course-dialog/add-course-dialog.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CourseService} from '../services/course.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component';

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
              private dialog: MatDialog) {
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

  deleteCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
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

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  loadCourses(){
    // todo: sarebbe più saggio visualizzare solo i corsi di quel prof
    this.courseService.getAll().subscribe(
      data => {
        console.log(data);
        this.courses = data;
        this.selectedItem = this.courses.findIndex(c => c.name === this.selectedItem) === -1 ? 'Seleziona un corso' : this.selectedItem;
      },
      error => console.log(error)
    );
  }

}

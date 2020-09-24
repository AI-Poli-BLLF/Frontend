import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Course} from '../../models/course.model';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../teacher/courses/delete-confirm-dialog/delete-confirm-dialog.component';
import {EditCourseDialogComponent} from '../../teacher/courses/edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
// componente simile a quello del teacher, ma non ho potuto riciclarlo perchè diverso
// in molte configurazioni, indirizzi e funzioni
export class AdminViewComponent implements OnInit, OnDestroy {
  homeS: Subscription;
  selectedItem: string;
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
      // ottengo la route attiva per vedere se sono sulla home così da cambiare i buttons attivi e la scritta del corso nella toolbar
      e => {
        // tslint:disable-next-line:no-unused-expression
        (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e;
        // se sono sulla tab di admin lo mostro nella toolbar al posto del nome del corso
        // tslint:disable-next-line:no-unused-expression
        this.router.url.includes('/admin/tools') ? this.selectedItem = 'Admin Tools' : e;
      }
    );
  }

  // all'avvio carico i corsi e in base alla route attiva mostro il nome del corso nella toolbar
  // o la scritta admin tools se sono nel component di admin
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

  // apro un dialog di conferma sull'eliminazione del corso
  // se confermata elimino il corso
  deleteCourseDialog(){
    // todo: unsubrscribe?
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
    dialogRef.afterClosed().subscribe(value => {
      // todo: da testare
      // tslint:disable-next-line:triple-equals
      if (value != 'true'){
        return;
    }
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

  // apro un dialog simile a quello della creazione del corso per modificarlo,
  // gli passo i parametri del corso attuale, per consentire la modifica
  // e successivamente dal dialog modifico
  // se il corso è stato modificato ricarico la pagina perchè si potrebbero verificare incongruenze
  startToEditCourse(){
    const course: Course = this.courses.find(c => c.name === this.selectedItem);
    this.courseService.getCourseVmModel(course.name)
      .subscribe(
        vmModel => {
          const d = {course, vmModel};
          const dialogRef = this.dialog.open(EditCourseDialogComponent, {data: d});
          dialogRef.afterClosed().subscribe(data => {
            // console.log(course.enabled, '!=', data);
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

  // se clicco su un corso nella sidebar cambio il nome del corso nella toolbar
  handleClick(selectedItem: Course) {
    this.selectedItem = selectedItem.name;
  }

  // se clicco su admin tools nella sidebar cambio il nome nella toolbar
  adminToolsClick() {
    this.selectedItem = 'Admin Tools';
  }

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
  }

  // carico i corsi da mostrare nella sidenav (per l'admin li carico tutti)
  loadCourses(){
    this.courseService.getAll().subscribe(
      data => {
        // console.log(data);
        this.courses = data.length > 0 ? data : [new Course('Nessun corso', false, 0, 0)] ;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento dei corsi.', 'Chiudi');
      }
    );
  }

}

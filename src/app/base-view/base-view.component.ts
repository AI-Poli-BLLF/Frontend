import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Course} from '../models/course.model';
import {MatSidenav} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CourseService} from '../services/course.service';
import {AuthService} from '../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddCourseDialogComponent} from '../teacher/courses/add-course-dialog/add-course-dialog.component';
import {DeleteConfirmDialogComponent} from '../teacher/courses/delete-confirm-dialog/delete-confirm-dialog.component';
import {EditCourseDialogComponent} from '../teacher/courses/edit-course-dialog/edit-course-dialog.component';
import {EnrollCourseDialogComponent} from '../student/enroll-course-dialog/enroll-course-dialog.component';

@Component({
  selector: 'app-base-view',
  templateUrl: './base-view.component.html',
  styleUrls: ['./base-view.component.css']
})
// view in comune tra studenti, professori e admin
// i link sono diversi sono gestiti dal base link
// che in base alla ruolo dell'utente viene impostato dalla set link

// gli elementi differenti tra i vari ruoli sono gestiti da ngIf
export class BaseViewComponent implements OnInit, OnDestroy {
  homeS: Subscription;
  deleteS: Subscription;
  addS: Subscription;
  editS: Subscription;
  selectedItem: string;

  baseLink: string;

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
    this.setBaseLink();
    this.homeS = router.events.subscribe(
      e => (e instanceof NavigationEnd && e.url === '/home') ? this.selectedItem = 'Seleziona un corso' : e
    );
  }

  // le route generate a partire dalla tipologia di utente
  // sono gestite dal base link
  // che in base alla ruolo dell'utente viene impostato dalla set link
  setBaseLink(){
    switch (this.authService.getRole()) {
      case 'ROLE_ADMIN':
        this.baseLink = '/admin';
        break;
      case 'ROLE_PROFESSOR':
        this.baseLink = '/teacher';
        break;
      default:
        this.baseLink = '/student';
        break;
    }
  }

  // metodi per capire la tipologia nell'html avendo il service privato
  isStudent(){
    return this.authService.getRole() === 'ROLE_STUDENT';
  }
  // metodi per capire la tipologia nell'html avendo il service privato
  isTeacher(){
    return this.authService.getRole() === 'ROLE_PROFESSOR';
  }
  // metodi per capire la tipologia nell'html avendo il service privato
  isAdmin(){
    return this.authService.getRole() === 'ROLE_ADMIN';
  }

  // all'init del componente carico i corsi e imposto il valore del select item
  // => variabile visualizzata nella toolbar e che permette
  // di capire quale corso ho attivo o admin tools nel caso degli admin
  ngOnInit(): void {
    this.loadCourses();
    const courseName = this.route.firstChild.snapshot.params.name;
    this.selectedItem = courseName === undefined ? 'Seleziona un corso' : courseName;
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  // apro una dialog per crere un corso, se l'aggiunta del corso va a buon fine
  // e la dialog mi torna true aggiorno i corsi
  openAddCourseDialog(){
    const dialogRef = this.dialog.open(AddCourseDialogComponent);
    this.addS = dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      if (data === true){
        this.loadCourses();
      }
    });
  }

  // se il corso è stato eliminato mostra una snackbar per notificare l'azione
  // e cambia il corso selezionato in nessun corso selezionato
  // riportando la route della pagina alla root
  snackBarDelete() {
    if (this.courses.findIndex(c => c.name === this.selectedItem) === -1) {
      this.snackBar.open('Corso cancellato', 'Chiudi');
      this.selectedItem = 'Seleziona un corso';
      this.router.navigate([this.baseLink]);
    }
  }

  // apre una dialog per chiedere conferma se voglio eliminare il corso
  // in caso affermativo la dialog ritorna true e viene richiesto al service
  // l'eliminazione del corso, in caso affermativo cancello il corso senza dovere
  // ricaricare la lista, in caso di errore mostro una snackbar di errore
  deleteCourseDialog(){
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {data: this.selectedItem});
    this.deleteS = dialogRef.afterClosed().subscribe(value => {
      // tslint:disable-next-line:triple-equals
      if (value != 'true'){
        return;
      }
      this.service.deleteOne(this.selectedItem).subscribe(
        () => {
          this.courses = this.courses.filter(c => c.name !== this.selectedItem);
          this.snackBarDelete();
        },
        error => {
          console.log(error);
          this.snackBar.open('Si è verificato un errore', 'Chiudi');
        }
      );

    });
  }

  // apro una dialog per modificare un corso, passandole il corso che devo modificare
  // alla chiusura della dialog ricarico i corsi
  // se viene modificato l'enabled passando da true a false o viceversa
  // faccio un redirect così da poter alla root
  startToEditCourse(){
    const course: Course = this.courses.find(c => c.name === this.selectedItem);
    this.editS = this.courseService.getCourseVmModel(course.name)
      .subscribe(
        vmModel => {
          const d = {course, vmModel};
          const dialogRef = this.dialog.open(EditCourseDialogComponent, {data: d});
          dialogRef.afterClosed().subscribe(data => {
            // console.log(course.enabled, '!=', data);
            this.loadCourses();
            // tslint:disable-next-line:triple-equals
            if (('' + course.enabled) != data) {
              this.selectedItem = 'Seleziona un corso';
              this.router.navigate([this.baseLink]);
            }
          });
        },
        error => {
          console.log(error);
          this.snackBar.open('Impossibile caricare il modello della Vm.', 'Chiudi');
        }
      );
  }

  // se un corso viene cliccato sulla sidebar imposto il suo nome
  // come elemento seleziona così da poterlo visualizzare sulla toolbar
  // e permettere l'interazione con la delete/edit/share
  handleClick(selectedItem: Course) {
    this.selectedItem = selectedItem.name;
  }

  ngOnDestroy(): void {
    this.homeS.unsubscribe();
    if (this.deleteS !== undefined){
      this.deleteS.unsubscribe();
    }
    if (this.addS !== undefined){
      this.addS.unsubscribe();
    }
    if (this.editS !== undefined){
      this.editS.unsubscribe();
    }
  }

  loadCourses(){
    let obs: Observable<Array<Course>>;
    switch (this.authService.getRole()) {
      case 'ROLE_ADMIN':
        obs = this.courseService.getAll();
        break;
      case 'ROLE_PROFESSOR':
        obs = this.courseService.getAllByProfessor(this.authService.getId());
        break;
      default:
        obs = this.courseService.getAllByStudent(this.authService.getId());
        break;
    }
    obs.subscribe(
      data => {
        this.courses = data;
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamento dei corsi.', 'Chiudi');
      }
    );
  }

  // permette di ottenere l'acronimo del corso più un '-' per formattare
  // correttamente il titolo nella toolbar del corso selezionato
  // questo non verrà ritornato nel caso in cui non ci siano corsi selezionati
  // o sia nel tool di admin del'admin
  getAcronym() {
    const course = this.courses.find(value => value.name === this.selectedItem);
    if (course === undefined) {
      return '';
    }
    return this.selectedItem !== 'Seleziona un corso' ?
      `${course.acronym} - ` : '';
  }

  // permette di disabilitare il click sui corsi disabilitati per gli studenti
  // i docenti comunque potranno continuare a cliccarci sopra per fare la edit
  // stessa cosa gli admin
  isDisabled(element: Course) {
    return (this.authService.getRole() === 'ROLE_STUDENT' && !element.enabled);
  }

  // quando viene cliccato su admin tools imposto l'elemento selezionato ad admin tools
  adminToolsClick() {
    this.selectedItem = 'Admin Tools';
  }

  // metodo per gli studenti, che permette di fare richiesta di aggiunta ad un corso
  // il metodo invia solo una notifica, quindi sarebbe inutile aggiornare la lista dei corsi
  // dato che finchè il prof non la accetta non sarà comunque presente il corso
  openEnrollDialog() {
    this.dialog.open(EnrollCourseDialogComponent);
  }
}

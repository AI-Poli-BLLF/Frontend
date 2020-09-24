import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../../models/assignment.model';
import {Draft} from '../../../models/draft.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AssignmentService} from '../../../services/assignment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import {AssignmentStudentsComponent} from '../../teacher/assignment-students/assignment-students.component';
import {DraftSComponent} from '../draft-s/draft-s.component';

@Component({
  selector: 'app-assignment-s',
  templateUrl: './assignment-s.component.html',
  styleUrls: ['./assignment-s.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AssignmentSComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Assignment>;

  columnsToDisplay: string[] = ['name', 'releaseDate', 'expiryDate', 'grade', 'state', 'link', 'upload'];
  expandedElement: Draft | null;
  @ViewChild(DraftSComponent) drafts: DraftSComponent;

  assignments: Array<Assignment>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sub: Subscription;
  courseName: string;
  studentId: string;

  constructor(
    private service: AssignmentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.dataSource = new MatTableDataSource<Assignment>(this.assignments);
    this.sub = this.route.parent.parent.params.subscribe(params => {
      this.courseName = params.name;
    });
    this.studentId = authService.getId();
  }

  ngOnInit(): void {
  }

  // ottengo la lista degli assignments relativi al corso selezionato
  ngAfterViewInit() {
    this.service.getAssignmentForCourse(this.courseName).subscribe(
      a => {
        // assegno l'ultimo draft a null così se non dovessero essercene di più recenti visualizzerò
        // stato NULL e grade Non valutato
        a.forEach(as => as.lastDraft = new Draft(0, undefined, 0, 'NULL', true));
        // ordino gli assignments per data decrescente
        this.dataSource.data = a.sort((e1, e2) => e2.releaseDateT.getTime() - e1.releaseDateT.getTime());
      },
      error => {
        console.log(error);
        this.snackBar.open('Si è verificato un errore nel caricamente delle consegne.', 'Chiudi');
      }
    );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // carico il draft selezionato schiacciando il tasto e notifico il suo caricamento o errore
  uploadDraft(element: Assignment, event){
    const selectedFile: File = event.target.files[0];
    // console.log(selectedFile);
    if (selectedFile === undefined){
      return;
    }
    this.service.uploadDraft(this.authService.getId(), this.courseName, element.id, selectedFile)
      .subscribe(
        data => {
          this.snackBar.open(
            'Elaborato caricato correttamente.', 'Chiudi');
          // permette di aggiungere un draft alla tabella senza ricarica scaricando tutta la lista dal server
          this.drafts.add(data);
        },
        error => {
          console.log(error);
          this.snackBar.open(
            'Si è verificato un errore nell\'upload dell\'elaborato. La massima dimensione consentita dei file è 3 MB.', 'Chiudi');
        }
      );
  }

  // metodo per definire se il bottone per l'upload sia abilitato o no
  canUpload(element: Assignment) {
    return element.lastDraft.state !== 'SUBMITTED' &&
      !element.lastDraft.locker;
  }

  // metodo chiamato dal component che elenca i draft per dire qual'è l'ultimo draft disponibile
  addLast(event: Draft, element: Assignment) {
    element.lastDraft = event;
  }

  // ritorna una scritta in base al voto => 0 == non valutato
  getGrade(element: Draft) {
    return element.grade > 0 ? element.grade : 'Non valutato';
  }
}

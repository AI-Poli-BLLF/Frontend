import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Draft} from '../../../models/draft.model';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../../models/assignment.model';
import {Student} from '../../../models/student.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Route} from '@angular/router';
import {AssignmentService} from '../../../services/assignment.service';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AddAssignmentDialogComponent} from '../add-assignment-dialog/add-assignment-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DraftEvaluateComponent} from '../draft-evaluate/draft-evaluate.component';
import {Subscription} from 'rxjs';
import {DraftHistoryComponent} from '../draft-history/draft-history.component';

@Component({
  selector: 'app-assignment-students',
  templateUrl: './assignment-students.component.html',
  styleUrls: ['./assignment-students.component.css']
})
// tabella degli studenti che hanno almeno letto l'assignment
export class AssignmentStudentsComponent implements OnInit, AfterViewInit, OnDestroy {
  columnsToDisplay: string[] = ['studentId', 'firstName', 'lastName', 'state', 'grade', 'timestampNumber', 'link', 'readCorrection', 'correction', 'evaluate', 'history'];
  dataSource: MatTableDataSource<Draft>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  assignmentId: number;
  @Input()
  courseName: string;

  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private assignmentService: AssignmentService) {
    this.dataSource = new MatTableDataSource<Draft>([]);
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }

  update(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDraftInfo(draft: Draft){
    if (draft.student.id === ''){
      this.assignmentService.getStudentForDraft(this.courseName, this.assignmentId, draft.id).subscribe(
        s => draft.student = s,
        error => {
          console.log(error);
          this.snackBar.open('Errore nel caricamente dello studente per la consegna', 'Chiudi');
        }
      );
    }
  }

  uploadCorrection(event, element: Draft){
    const selectedFile: File = event.target.files[0];
    // console.log(selectedFile);
    if (selectedFile === undefined){
      return;
    }
    this.assignmentService.uploadCorrection(this.courseName, this.assignmentId, element.id, selectedFile)
      .subscribe(
        () => {
          this.snackBar.open(
            'Correzione caricata correttamente.', 'Chiudi');
          element.state = 'REVIEWED';
          element.timestampT = new Date(Date.now());
          },
        error => {
          console.log(error);
          this.snackBar.open(
            'Si è verificato un errore nell\'upload della correzione. La massima dimensione consentita dei file è 3 MB.',
            'Chiudi');
        }
      );
  }

  // apro una dialog per effettuare la valutazione
  // in caso positivo la dialog alla chiusura mi tornerà il voto
  // così potrò aggiuegnrlo alla tabella senza riscaricare i dati
  evaluateDraft(element: Draft){
    const c = { data: {courseName: this.courseName, draftId: element.id, assignmentId: this.assignmentId}};
    const dialogRef = this.dialog.open(DraftEvaluateComponent, c);
    this.sub = dialogRef.afterClosed().subscribe( data => {
      if (data !== undefined && data.grade !== undefined){
        const i = this.dataSource.data.findIndex(e => e.id === element.id);
        this.dataSource.data[i].locker = true;
        this.dataSource.data[i].state = 'REVIEWED';
        this.dataSource.data[i].grade = data.grade;
      }
    });
  }

  // pulsante per aprire la storia dello studente
  // il componente non è dummy, così mi risparmio lo scaricamento
  // dei dati nel caso in cui non sia mai aperto
  historyStudent(element: Draft){
    const c = { data: {courseName: this.courseName, studentId: element.student.id, assignmentId: this.assignmentId}};
    this.dialog.open(DraftHistoryComponent, c);
  }

  // funzioni che permettono di diabilitare i pulsanti in caso ci sia una correzione, un draft caricato o sia stato o meno già valutato
  canOpen(element: Draft) {
    return (element.state !== 'READ' && element.state !== 'NULL');
  }
  // funzioni che permettono di diabilitare i pulsanti in caso ci sia una correzione, un draft caricato o sia stato o meno già valutato
  canCorrection(element: Draft) {
    return (element.state === 'SUBMITTED');
  }
  // funzioni che permettono di diabilitare i pulsanti in caso ci sia una correzione, un draft caricato o sia stato o meno già valutato
  canOpenCorrection(element: Draft) {
    return (element.state === 'REVIEWED');
  }
  // funzioni che permettono di diabilitare i pulsanti in caso ci sia una correzione, un draft caricato o sia stato o meno già valutato
  canEvaluate(element: Draft){
    return (element.locker === false);

  }

  // carico l'ultimo draft degli studenti che hanno almeno letto l'assignment
  // e li ordino per data decrescente
  private loadData() {
    this.assignmentService.getProfessorDrafts(this.courseName, this.assignmentId)
      .subscribe(
        drafts => {
          drafts = drafts.sort((d1, d2) => d2.timestampT.getTime() - d1.timestampT.getTime());
          drafts.forEach(d => this.getDraftInfo(d));
          this.dataSource.data = drafts;
          this.update();
        },
        err => {
          console.log(err);
          this.snackBar.open('Errore nel caricamente degli elaborati', 'Chiudi');
        }
      );
  }

  // filtro la tabella dei draft in base allo stato
  applyFilter(event) {
    const filterValue = event.value;
    this.dataSource.filter = filterValue === 'all' ? '' : filterValue;
  }

  // ritorno un valore testuale nel caso in cui il voto sia = 0 per la visualizzazione
  getGrade(element: Draft) {
    return element.grade > 0 ? element.grade : 'Non valutato';
  }

}

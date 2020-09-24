import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Draft} from '../../../models/draft.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AssignmentService} from '../../../services/assignment.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-draft-s',
  templateUrl: './draft-s.component.html',
  styleUrls: ['./draft-s.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
// componente che permette di elencare i draft di uno studente
export class DraftSComponent implements OnInit {
  dataSource: MatTableDataSource<Draft>;
  columnsToDisplayDraft: string[] = ['state', 'timestamp', 'link', 'correction'];
  drafts: Array<Draft> = [];
  studentId: string;
  sub: Subscription;
  @Input()
  courseName: string;
  @Input()
  assignmentId: number;

  @Output()
  lastDraft: EventEmitter<Draft>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: AssignmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.lastDraft = new EventEmitter<Draft>();
    this.studentId = authService.getId();
    this.dataSource = new MatTableDataSource<Draft>(this.drafts);
  }

  ngOnInit(): void {
    this.update();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // vengono ottenuti i draft relativi allo studente e ordinati per data
  // il più nuovo viene mandato al component padre che lo visualizzerà
  update(){
    this.service.getDraftForStudent(this.studentId, this.courseName, this.assignmentId).subscribe(
      d => {
        const v = d.sort((d1, d2) => d2.timestampT.getTime() - d1.timestampT.getTime());
        this.dataSource.data = v;
        this.lastDraft.emit(v.length > 0 ? v[0] : new Draft(0, undefined, 0, 'NULL', true));
      },
      err => {
        console.log(err);
        this.snackBar.open('Errore nel caricamento degli elaborati', 'Chiudi');
      }
    );
  }

  checkError(draft: Draft): boolean{
    return !(draft.locker === true || draft.state === 'SUBMITTED' || draft.state === 'REVIEWED');
  }

  // metodo per disabilitare il tasto nel caso in cui non ci sia nessun draft caricato da vedere
  canOpen(element: Draft) {
    return element.state === 'SUBMITTED' || element.state === 'REVIEWED';
  }

  // metodo per disabilitare il tasto nel caso in cui non ci sia nessuna correzione caricato da vedere
  canOpenCorrection(element: Draft) {
    return element.state === 'REVIEWED';
  }

  // permette di aggiungere un draft senza ricarica scaricando tutta la lista dal server
  add(element: Draft) {
    const v = [...this.dataSource.data];
    v.unshift(element);
    this.dataSource.data = v;
    this.lastDraft.emit(element);
  }
}

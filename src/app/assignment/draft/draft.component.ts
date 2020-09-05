import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Assignment} from '../../models/assignment.model';
import {Draft} from '../../models/draft.model';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent implements OnInit {

  columnsToDisplay: string[] = ['id', 'matricola', 'stato', 'ultima modifica'];
  dataSource: MatTableDataSource<Draft>;

  constructor() { }

  ngOnInit(): void {
  }

}

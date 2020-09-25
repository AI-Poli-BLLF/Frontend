import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {VmConfig} from '../../../models/vm.config.model';
import {Team} from '../../../models/team.model';
import {CourseService} from '../../../services/course.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-vm-table',
  templateUrl: './vm-table.component.html',
  styleUrls: ['./vm-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
// componente contenente una tabella estendibile
// il livello estenrno elenca tutte le configurazioni,
// una per ogni team e faccendo click sulla riga l'elemento viene esteso
// mostrando le singole vm di quel corso, permettendo di editare le vm config
// e mostrando l'uso delle risorse
export class VmTableComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  teams: Team[];
  @Input()
  courseName: string;
  dataSource: MatTableDataSource<VmConfig>;
  columnsToDisplay: string[] = ['id', 'groupName', 'maxCpu', 'maxRam', 'maxDisk', 'maxVm', 'maxActive'];
  columnsNames = {id: 'Id', groupName: 'Team', maxCpu: 'CPU', maxRam: 'Ram (MB)', maxDisk: 'Storage (GB)', maxVm: 'Vm creabili', maxActive: '# Vm attive'};
  expandedElement: VmConfig | null;

  constructor(private courseService: CourseService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @Input()
  set Teams(t: Array<Team>){
    // console.log('Enrolled setter');
    this.teams = t === undefined ? [] : t;
    this.dataSource.data = [];
    this.teams.forEach(team => this.loadConfig(team));
  }

  // caric la configurazione chiedendola al server
  loadConfig(team: Team){
    // console.log(this.courseName);
    this.courseService.getTeamVMConfig(this.courseName, team.id, team.name)
      .subscribe(t => {
        const v = [...this.dataSource.data];
        v.push(t);
        this.dataSource.data = v;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  // se un elemento viene modificato nel componente figlio emette un evento
  // che permetterà di modificare il padre senza riscaricaare i dati dal server
  updateElement(vmC: VmConfig) {
    const v: VmConfig[] = [];
    this.dataSource.data.forEach(e => e.id === vmC.id ? v.push(vmC) : v.push(e));
    this.dataSource.data = v;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

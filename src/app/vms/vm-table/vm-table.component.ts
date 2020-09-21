import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {VmConfig} from '../../models/vm.config.model';
import {Team} from '../../models/team.model';
import {CourseService} from '../../services/course.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

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
export class VmTableComponent implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  teams: Team[];
  @Input()
  courseName: string;
  vmConfig: VmConfig[];
  dataSource: MatTableDataSource<VmConfig>;
  columnsToDisplay: string[] = ['id', 'groupName', 'maxCpu', 'maxRam', 'maxDisk', 'maxVm', 'maxActive'];
  columnsNames = {id: 'Id', groupName: 'Team', maxCpu: 'CPU', maxRam: 'Ram (MB)', maxDisk: 'Storage (GB)', maxVm: 'Vm creabili', maxActive: '# Vm attive'};
  expandedElement: VmConfig | null;

  constructor(private courseService: CourseService) {
    this.dataSource = new MatTableDataSource(this.vmConfig);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  @Input()
  set Teams(t: Array<Team>){
    console.log('Enrolled setter');
    this.teams = t === undefined ? [] : t;
    this.vmConfig = [];
    this.teams.forEach(team => this.loadConfig(team));
  }

  loadConfig(team: Team){
    // console.log(this.courseName);
    this.courseService.getTeamVMConfig(this.courseName, team.id, team.name)
      .subscribe(t => {
        // console.log(t);
        // todo: trovare un migliore modo per aggiornare
        const v = [...this.vmConfig];
        v.push(t);
        this.vmConfig = v;
      });
  }

  updateElement(vmC: VmConfig) {
    const v: VmConfig[] = [];
    this.vmConfig.forEach(e => e.id === vmC.id ? v.push(vmC) : v.push(e));
    this.vmConfig = v;
  }
}

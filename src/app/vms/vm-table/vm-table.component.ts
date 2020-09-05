import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {VmConfig} from '../../models/vm.config.model';
import {Team} from '../../models/team.model';
import {CourseService} from '../../services/course.service';

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
export class VmTableComponent{
  teams: Team[];
  @Input()
  courseName: string;
  vmConfig: VmConfig[];
  columnsToDisplay: string[] = ['id', 'groupName', 'maxCpu', 'maxRam', 'maxDisk', 'maxVm', 'maxActive'];
  expandedElement: VmConfig | null;

  constructor(private courseService: CourseService) {
    // console.log(this.courseName);
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

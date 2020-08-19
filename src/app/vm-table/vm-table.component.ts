import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {VmGroup} from '../models/vm.group.model';

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
export class VmTableComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay: string[] = ['id', 'groupName', 'maxCpu', 'maxRam', 'maxDisk', 'maxVm', 'maxActive'];
  expandedElement: PeriodicElement | null;
}

const ELEMENT_DATA: VmGroup[] = [
  new VmGroup(1, 'gruppo sfigato', 1, 512, 512, 1, 1),
  new VmGroup(2, 'gruppo figo', 10, 16384, 10240, 10, 5),
  new VmGroup(3, 'un altro gruppo', 5, 16384, 10240, 10, 5),
  new VmGroup(4, 'gruppo', 5, 1384, 1240, 2, 2),
  new VmGroup(5, 'gruppo boh', 5, 1634, 1020, 3, 2)

];

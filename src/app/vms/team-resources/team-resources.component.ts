import {Component, Input, OnInit} from '@angular/core';
import {VmConfig} from '../../models/vm.config.model';

@Component({
  selector: 'app-team-resources',
  templateUrl: './team-resources.component.html',
  styleUrls: ['./team-resources.component.css']
})
export class TeamResourcesComponent {
  @Input()
  vmConfig: VmConfig = new VmConfig(-1, -1, '', 0, 0, 0, 0, 0);
  @Input()
  cpu: number;
  @Input()
  ram: number;
  @Input()
  disk: number;
  @Input()
  active: number;
  @Input()
  vmNumber: number;

  constructor() { }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 100) / 10 + 'GB';
    } else{ return value + ' MB'; }
  }

  diskLabel(value: number){
    return value + ' GB';
  }
}

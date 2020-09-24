import {Component, Input, OnInit} from '@angular/core';
import {VmConfig} from '../../models/vm.config.model';

@Component({
  selector: 'app-team-resources',
  templateUrl: './team-resources.component.html',
  styleUrls: ['./team-resources.component.css']
})
// componente che permette di vedere le risorse attualmente usate
// da parte di un team
// riceve in ingresso la vmConfig con i limiti massimi
// e le singole risorse usate per ogni parametro
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

  // permette di aggiungere l'eticchetta TB/GB/MB alla label/ mat slider
  formatLabel(value: number) {
    if (value >= 1024 * 1024) {
      return Math.round(value / (1024 * 102.4)) / 10 + 'TB';
    }
    else if (value >= 1024) {
      return Math.round(value / 102.4) / 10 + 'GB';
    } else{ return value + 'MB'; }
  }

  // permette di aggiungere l'eticchetta TB/GB alla label/ mat slider
  diskLabel(value: number){
    if (value >= 1024) {
      return Math.round(value / 102.4) / 10 + 'TB';
    } else {
      return value + 'GB';
    }
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VmConfig} from '../../../models/vm.config.model';

@Component({
  selector: 'app-vm-edit-resources',
  templateUrl: './vm-edit-resources.component.html',
  styleUrls: ['./vm-edit-resources.component.css']
})
// dummy component che permette di creare i dati di configurazione
// massimi delle vm dei team, riceve in input una configurazione
// per inizializzare i mat sliders ai valori pre modifica
// alla pressione del tasto save lancia un evento con la nuova
// configurazione al padre
export class VmEditResourcesComponent {
  @Output()
  emitConfig = new EventEmitter<VmConfig>();
  @Input()
  vmConfigNew: VmConfig;

  constructor() {}

  save(){
    this.emitConfig.emit(this.vmConfigNew);
  }

  // permette di aggiungere l'eticchetta GB/MB alla label/ mat slider
  formatLabel(value: number) {
    // console.log(value);
    if (value >= 1024) {
      return Math.round(value / 102.4) / 10 + 'GB';
    } else{ return value + 'MB'; }
  }
  // permette di aggiungere l'eticchetta GB alla label/ mat slider
  diskLabel(value: number){
    return value + 'GB';
  }
}

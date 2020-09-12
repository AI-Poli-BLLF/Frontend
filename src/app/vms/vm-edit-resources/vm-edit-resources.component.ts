import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VmConfig} from '../../models/vm.config.model';

@Component({
  selector: 'app-vm-edit-resources',
  templateUrl: './vm-edit-resources.component.html',
  styleUrls: ['./vm-edit-resources.component.css']
})
export class VmEditResourcesComponent {
  @Output()
  emitConfig = new EventEmitter<VmConfig>();
  @Input()
  vmConfigNew: VmConfig;

  constructor() {}

  save(){
    this.emitConfig.emit(this.vmConfigNew);
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 100) / 10 + 'GB';
    } else{ return value + 'KB'; }
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VmModelsList} from '../../models/vm.models.list.model';

@Component({
  selector: 'app-vm-models-table',
  templateUrl: './vm-models-table.component.html',
  styleUrls: ['./vm-models-table.component.css']
})
// dummy component che si occupa di visualizzare i modelli delle vm
export class VmModelsTableComponent {
  @Input()
  vmModelsList: VmModelsList[] = [];
  displayedColumns: string[] = ['os', 'version', 'addVersion', 'deleteVersion', 'deleteOs'];

  @Output()
  addV = new EventEmitter();

  @Output()
  delOs = new EventEmitter();

  @Output()
  delV = new EventEmitter();

  constructor() {
  }

  getVersions(vml: VmModelsList){
    return vml.versions
      .reduce((previousValue, currentValue, currentIndex) =>
        previousValue + (currentIndex !== 0 ? ' / ' : '') + currentValue, '');
  }

  addVersion(element: VmModelsList){
    this.addV.emit(element);
  }

  deleteOS(element: VmModelsList){
    this.delOs.emit(element);
  }
  deleteVersions(element: VmModelsList){
    this.delV.emit(element);
  }

}

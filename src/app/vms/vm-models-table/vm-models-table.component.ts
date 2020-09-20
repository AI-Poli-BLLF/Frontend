import {Component, Input, OnInit} from '@angular/core';
import {VmModelsList} from '../../models/vm.models.list.model';

@Component({
  selector: 'app-vm-models-table',
  templateUrl: './vm-models-table.component.html',
  styleUrls: ['./vm-models-table.component.css']
})
export class VmModelsTableComponent {
  @Input()
  vmModelsList: VmModelsList[] = [];
  displayedColumns: string[] = ['id', 'os', 'version'];

  constructor() {
  }

  getVersions(vml: VmModelsList){
    return vml.versions
      .reduce((previousValue, currentValue, currentIndex) =>
        previousValue + (currentIndex !== 0 ? ' / ' : '') + currentValue, '');
  }

}

import { Component, OnInit } from '@angular/core';
import {Vm} from '../models/vm.model';
import {Student} from '../models/student.model';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-vm-sub-table',
  templateUrl: './vm-sub-table.component.html',
  styleUrls: ['./vm-sub-table.component.css']
})
export class VmSubTableComponent{
  cpuValidator = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(8)]);
  diskValidator = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(512)]);
  ramValidator = new FormControl('', [Validators.required, Validators.minLength(128), Validators.maxLength(10240)]);


  columnsToDisplay: string[] = ['id', 'creator', 'state', 'cpu', 'ramSize', 'diskSize'];
  dataSource = ELEMENT_DATA;
}

const ELEMENT_DATA: Vm[] = [
  new Vm(
    1,
    new Student('s123456', 'Pluto', 'Paperino', 'aaa', 's123456@polito.it'),
    false,
    2,
    1024,
    2048
  ),
  new Vm(
    2,
    new Student('s123457', 'Eta', 'Beta', 'aaa', 's123457@polito.it'),
    true,
    4,
    1024,
    2048
  ),
];

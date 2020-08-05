import { Component, OnInit } from '@angular/core';
import {NavModel} from '../nav.model';

@Component({
  selector: 'app-tab-component',
  templateUrl: './tab-component.component.html',
  styleUrls: ['./tab-component.component.css']
})
export class TabComponentComponent implements OnInit {
  links: Array<NavModel> = [
    new NavModel('./students', 'Students'),
    new NavModel('./vms', 'VMs')
  ];
  constructor() { }

  ngOnInit(): void {
  }

}

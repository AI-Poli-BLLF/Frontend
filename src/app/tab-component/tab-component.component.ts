import { Component, OnInit } from '@angular/core';
import {NavModel} from '../nav.model';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-tab-component',
  templateUrl: './tab-component.component.html',
  styleUrls: ['./tab-component.component.css']
})

// todo: disabilitare tab se il corso è disabilitato
export class TabComponentComponent implements OnInit {
  links: Array<NavModel>;
  linksStudent: Array<NavModel> = [
    new NavModel('./vms', 'VMs'),
    new NavModel('./teams', 'Teams')
  ];
  linksTeacher: Array<NavModel> = [
    new NavModel('./students', 'Students'),
    new NavModel('./vms', 'VMs'),
    new NavModel('./assignments', 'Assignments'),
  ];
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    switch (this.authService.getRole()) {
      case 'ROLE_STUDENT':
        this.links = this.linksStudent;
        break;
      case 'ROLE_PROFESSOR':
        this.links = this.linksTeacher;
        break;
    }
  }

}

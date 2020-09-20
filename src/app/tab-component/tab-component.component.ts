import { Component, OnInit } from '@angular/core';
import {NavModel} from '../nav.model';
import {AuthService} from '../services/auth.service';
import {CourseService} from "../services/course.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {Course} from "../models/course.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-tab-component',
  templateUrl: './tab-component.component.html',
  styleUrls: ['./tab-component.component.css']
})

export class TabComponentComponent {
  links: Array<NavModel> = [];
  course: Course = new Course('', false, 0, 0);
  sub: Subscription;
  linksStudent: Array<NavModel> = [
    new NavModel('./vms', 'VMs'),
    new NavModel('./teams', 'Teams'),
    new NavModel('./assignment', 'Assignments')
  ];
  linksTeacher: Array<NavModel> = [
    new NavModel('./students', 'Studenti'),
    new NavModel('./vms', 'VMs'),
    new NavModel('./assignments', 'Consegne'),
  ];
  constructor(private authService: AuthService,
              private courseService: CourseService,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute) {
    this.sub = this.route.params.subscribe(params => {
      this.getCourse(params.name);
    });
  }

  getCourse(courseName: string){
    this.courseService.getOne(courseName)
      .subscribe(
        data => {
          console.log(data);
          this.course = data;
          this.loadLinks();
        },
        error => {
          console.log(error);
          this.snackbar.open('Impossibile caricare le informazioni sul corso', 'Chiudi');
        }
      );
  }

  loadLinks(){
    switch (this.authService.getRole()) {
      case 'ROLE_STUDENT':
        this.links = this.course.enabled ? this.linksStudent : [];
        break;
      case 'ROLE_PROFESSOR':
        this.links = this.course.enabled ? this.linksTeacher : [];
        break;
    }
  }

}

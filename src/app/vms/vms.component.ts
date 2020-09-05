import { Component, OnInit } from '@angular/core';
import {Team} from '../models/team.model';
import {CourseService} from '../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-vms-home',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {
  teams: Team[];
  courseName = '';
  private sub: Subscription;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
      // console.log(params);
    });
  }

  loadTeams(courseName: string){
    // console.log('load teams');
    this.courseService.getTeamsForCourse(courseName).subscribe(teams => this.teams = teams);
  }

  ngOnInit(): void {
    this.loadTeams(this.courseName);
  }

}

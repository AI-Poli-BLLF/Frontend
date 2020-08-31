import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service';
import {Team} from '../models/team.model';
import {Student} from '../models/student.model';
import {MatDialog} from '@angular/material/dialog';
import {CreateTeamDialogComponent} from './create-team-dialog/create-team-dialog.component';
import {Observable} from 'rxjs';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Course} from '../models/course.model';
import {CourseService} from '../services/course.service';

type TeamData = {
  team: Team;
  teamMembers: Observable<Student[]>;
  teamProposer: Observable<Student>;
};

@Component({
  selector: 'app-team-home',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: TeamData[];
  activeTeam: boolean;
  course: Course;
  constructor(private teamService: TeamService,
              private courseService: CourseService,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
    this.activeTeam = false;
    this.teams = new Array<TeamData>();
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe((params: ParamMap) => {
      const courseName = params.get('name');
      this.courseService.getOne(courseName).subscribe( c => this.course = c);
    });

    this.teamService.getTeamsByStudent(this.course.name)
      .subscribe(data => {
        const teamArray: Team[] = data;
        for (const i in teamArray) {
          if (data.hasOwnProperty(i)) {
            const team: Team = data[i];
            if (team.status === 'ACTIVE') {
              this.activeTeam = true;
            }
            console.log('Requesting members of team ' + team.id);
            const members$ = this.teamService.getTeamMembers(this.course.name, team.id);
            const proposer$ = this.teamService.getTeamProposer(this.course.name, team.id);
            this.teams.push({team, teamMembers: members$, teamProposer: proposer$});
          }
        }
      });
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: { course: this.course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.proposeTeam(this.course.name, result.teamName, result.members, result.timeout)
          .subscribe(
            data => {
              console.log(data);
            }
          );
      }
    });
  }

}

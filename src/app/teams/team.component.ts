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
  activeMembers: Observable<Student[]>;
  pendingMembers: Observable<Student[]>;
  proposer: Observable<Student>;
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
    // 1. Get the course name
    this.route.parent.paramMap.subscribe((params: ParamMap) => {
      const courseName = params.get('name');

      // 2. Get infos about the user's teams in this course
      this.teamService.getTeamsByStudent(courseName)
        .subscribe(data => {
          const teamArray: Team[] = data;
          for (const i in teamArray) {
            if (data.hasOwnProperty(i)) {
              this.getTeamInfos(courseName, data[i]);
            }
          }
        });

      // 3. Get infos about the course (e.g. min/max of team members)
      this.courseService.getOne(courseName).subscribe( c => this.course = c);
      // this.course = new Course(courseName, true, 2, 4);
    });
  }

  private getTeamInfos(courseName: string, team: Team) {
    if (team.status === 'ACTIVE') {
      this.activeTeam = true;
    }
    console.log('Requesting members of team ' + team.id);
    const activeMembers$ = this.teamService.getTeamMembersByStatus(courseName, team.id, true);
    const pendingMembers$ = this.teamService.getTeamMembersByStatus(courseName, team.id, false);
    const proposer$ = this.teamService.getTeamProposer(courseName, team.id);
    this.teams.push({team, activeMembers: activeMembers$, pendingMembers: pendingMembers$, proposer: proposer$});
  }

  openCreateTeamDialog(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: { course: this.course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.proposeTeam(this.course.name, result.value.teamName, result.value.members, result.value.timeout)
          .subscribe(
            data => {
              console.log(data);
            }
          );
      }
    });
  }

}

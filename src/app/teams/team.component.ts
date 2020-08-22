import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service';
import {Observable} from 'rxjs';
import {Team} from '../models/team.model';

@Component({
  selector: 'app-team-home',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams$: Observable<Team[]>;

  constructor(private service: TeamService) {
  }



  ngOnInit(): void {
    this.teams$ = this.service.getTeamsByStudent('ai', 'abc');
  }

}

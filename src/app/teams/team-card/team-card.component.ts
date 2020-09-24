import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Team} from '../../models/team.model';
import {Student} from '../../models/student.model';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
// dummy component che si occupa di rappresentare un team
export class TeamCardComponent implements OnInit {
  @Input()
  team: Team;
  @Input()
  members: Student[];
  @Input()
  delete = true;

  @Output()
  deleteTeam = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  getStatus() {
    switch (this.team.status) {
      case 'ACTIVE':
        return 'ATTIVO';
      case 'PENDING':
        return 'IN ATTESA';
      default:
        return this.team.status;
    }
  }

  remove(){
   this.deleteTeam.emit();
  }
}

import {Component, OnInit} from '@angular/core';
import {Team} from '../../../models/team.model';
import {CourseService} from '../../../services/course.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {VmModel} from '../../../models/vm.model.model';
// container della tabella per visualizzare le vm nel professore e nell'admin
// passa il nome del corso e l'elenco dei teams al componente figlio che genera la tabella
@Component({
  selector: 'app-vms-home',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {
  teams: Team[];
  vmModels: VmModel[] = [];
  courseName = '';
  private sub: Subscription;
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.sub = this.route.parent.params.subscribe(params => {
      this.courseName = params.name;
      // console.log(params);
    });
  }

  loadTeams(courseName: string){
    // console.log('load teams');
    this.courseService.getTeamsForCourse(courseName).subscribe(teams => this.teams = teams.filter(t => t.status === 'ACTIVE'));
  }

  ngOnInit(): void {
    this.loadTeams(this.courseName);
  }

}

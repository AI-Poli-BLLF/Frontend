import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  firstName: string;
  lastName: string;
  sub: Subscription;
  courseName = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.firstName = 'Pippo';
    this.lastName = 'Pippo';
    this.sub = this.route.params.subscribe(
      data => {
        this.courseName = this.router.url.includes('/admin/tools') ? 'Admin Tools' : data.name;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

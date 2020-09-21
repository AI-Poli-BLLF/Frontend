import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ProfileService} from './services/profile.service';
import {AuthService} from './services/auth.service';
import {Profile} from './models/profile.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  profile: Profile;
  sub: Subscription;
  sub2: Subscription;
  courseName = '';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router) {
    this.profile = new Profile('', '', '', '', '');
    if (this.authService.getRole() !== 'ROLE_ADMIN'){
      this.sub2 = this.profileService.get().subscribe(
        data => this.profile = data,
        error => {
          console.log(error);
        }
      );
    }
    this.sub = this.route.params.subscribe(
      data => {
        console.log(data.name);
        const name = data.name === undefined ? 'Seleziona un corso' : data.name;
        this.courseName = this.router.url.includes('/admin/tools') ? 'Admin Tools' : name;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

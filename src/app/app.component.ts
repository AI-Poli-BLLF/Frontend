import {Component, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoginDialogComponent} from './login/login-dialog/login-dialog.component';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';
import {ProfileViewButtonComponent} from './profile-view/profile-view-button.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'ai20-lab04';
  doLogin: Subscription;

  @ViewChild(LoginDialogComponent)
  loginDialog: LoginDialogComponent;

  @ViewChild(ProfileViewButtonComponent)
  profileView: ProfileViewButtonComponent;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService) {

    this.doLogin = route.queryParams.subscribe(
      q => {
        (q.doLogin === 'true' && !authService.isLogged()) || (q.doLogin === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialog() : q;
        (q.doReg === 'true' && !authService.isLogged()) || (q.doReg === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialogReg() : q;
      });
  }

  logInOut(event){
    if (event === 'login'){
      this.profileView.getImage();
    }
  }

  ngOnDestroy(): void {
    this.doLogin.unsubscribe();
  }

  toggleForMenuClick() {

  }
}

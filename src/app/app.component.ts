import {Component, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit{
  title = 'ai20-lab04';
  doLogin: Subscription;

  @ViewChild(LoginDialogComponent)
  loginDialog: LoginDialogComponent;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService) {
    // route.paramMap.subscribe(params => console.log(params.get()));


    this.doLogin = route.queryParams.subscribe(
      q => {
        (q.doLogin === 'true' && !authService.isLogged()) || (q.doLogin === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialog() : q;
        (q.doReg === 'true' && !authService.isLogged()) || (q.doReg === 'false' && authService.isLogged()) ?
          this.loginDialog.openDialogReg() : q;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.doLogin.unsubscribe();
  }

  toggleForMenuClick() {

  }
}

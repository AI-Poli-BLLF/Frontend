import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  template: '<button mat-button [queryParams]=getQueryParams() routerLink="/home"><mat-icon>login</mat-icon><span>{{loginButtonState}}</span></button>',
  styleUrls: ['login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  loginButtonState: string;

  constructor(public dialog: MatDialog, private authService: AuthService,  private router: Router ) {
  }

  ngOnInit(): void {
    this.authService.isLogged() ? this.loginButtonState = 'Logout' : this.loginButtonState = 'Login';
  }

  getQueryParams(){
    return this.authService.isLogged() ? { doLogin: 'false' } : { doLogin: 'true' };
  }

  openDialog() {
    if (!this.authService.isLogged()){
      const dialogRef = this.dialog.open(LoginDialogContentComponent);

      dialogRef.afterClosed().subscribe(() => {
        this.authService.isLogged() ? this.loginButtonState = 'Logout' : this.loginButtonState = 'Login';
        this.router.navigate(['/home']);
      });
    } else {
      this.authService.removeJwt();
      this.loginButtonState = 'Login';
      this.router.navigate(['/home']);
    }
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'login-dialog.component.html',
  styleUrls: ['login-dialog.component.css']
})
export class LoginDialogContentComponent {
  usernameValidator = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
  passwordValidator = new FormControl('', [Validators.required, Validators.maxLength(255)]);

  labelValue: string;

  constructor(private service: AuthService, private dialogRef: MatDialogRef<LoginDialogComponent>) {
  }

  getUsernameErrorMessage() {
    if (this.usernameValidator.hasError('required')) {
      return 'You must enter a value';
    }
    return this.usernameValidator.hasError('email') || this.usernameValidator.hasError('maxLength') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.passwordValidator.hasError('required')) {
      return 'You must enter a value';
    }
    return this.passwordValidator.hasError('maxLength') ? 'Not a valid email' : '';
  }

  login(){
    this.service.login(this.usernameValidator.value, this.passwordValidator.value)
      .subscribe(
        data => {
          this.service.setJwt(data.accessToken);
          this.dialogRef.close();
        },
        error => error.status === 400 ?
          this.labelValue = 'Username or password not valid' : this.labelValue = 'An error has occurred'
      );
  }

}

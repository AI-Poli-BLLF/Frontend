import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {RegistrationDialogComponent} from '../registration-dialog/registration-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.component.html',
  styleUrls: ['login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  @Output()
  logInOut = new EventEmitter<string>();

  loginButtonState: string;

  constructor(public dialog: MatDialog, private authService: AuthService,  private router: Router ) {
  }

  ngOnInit(): void {
    this.authService.isLogged() ? this.loginButtonState = 'Logout' : this.loginButtonState = 'Login';
  }

  regIsVisible(){
    return !this.authService.isLogged();
  }

  getQueryParams(){
    return this.authService.isLogged() ? { doLogin: 'false' } : { doLogin: 'true' };
  }

  getQueryParamsReg(){
    return { doReg: 'true' };
  }

  openDialog() {
    if (!this.authService.isLogged()){
      const dialogRef = this.dialog.open(LoginDialogContentComponent);
      dialogRef.afterClosed().subscribe(() => {
        this.authService.isLogged() ? this.loginButtonState = 'Logout' : this.loginButtonState = 'Login';
        this.router.navigate(['/']);
        this.logInOut.emit(this.authService.isLogged() ? 'login' : 'logout');
      });
    } else {
      this.authService.removeJwt();
      this.loginButtonState = 'Login';
      this.router.navigate(['/home']);
      this.logInOut.emit('logout');
    }
  }

  openDialogReg() {
    if (!this.authService.isLogged()){
      const dialogRef = this.dialog.open(RegistrationDialogComponent);
      dialogRef.afterClosed().subscribe(() => {
        this.authService.isLogged() ? this.loginButtonState = 'Logout' : this.loginButtonState = 'Login';
        this.router.navigate(['/home']);
      });
    }
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'login-dialog-content.component.html',
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
      return 'Devi inserire un valore.';
    }
    return this.usernameValidator.hasError('email') || this.usernameValidator.hasError('maxlength') ? 'Email non valida.' : '';
  }

  getPasswordErrorMessage() {
    if (this.passwordValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.passwordValidator.hasError('maxlength') ? 'Password non valida.' : '';
  }

  login(){
    if (
      this.usernameValidator.invalid ||
      this.passwordValidator.invalid) {
      this.labelValue = 'Completa correttamente tutti i campi.';
      return;
    }
    this.service.login(this.usernameValidator.value, this.passwordValidator.value)
      .subscribe(
        data => {
          this.service.setJwt(data.token);
          this.dialogRef.close();
        },
        error => error.status === 401 ?
          this.labelValue = 'Username or password not valid' : this.labelValue = 'An error has occurred'
      );
  }

}

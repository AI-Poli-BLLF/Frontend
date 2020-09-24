import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
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
    // in base al fatto che sia loggato o meno mostro la scritta sul tasto per effettuare il login o il logout
    this.authService.isLogged() ? this.loginButtonState = 'Logout' : this.loginButtonState = 'Login';
  }

  // se sono già loggato non mostro il tasto di registrazione
  regIsVisible(){
    return !this.authService.isLogged();
  }

  // in base al fatto che sia loggato o meno cambio i parametri nell'indirizzo
  getQueryParams(){
    return this.authService.isLogged() ? { doLogin: 'false' } : { doLogin: 'true' };
  }

  // imposto il parametro per fare la registrazione
  getQueryParamsReg(){
    return { doReg: 'true' };
  }

  // alla pressione del tasto di login se sono loggato effettuo il logout o vicevera
  // nel caso di login apro un dialog e alla sua chiusura se è andato a buon fine aggiorno la pagina
  // questo mi permetterà di caricare il welcome component ed essere indirizzato alla pagina con il ruolo corretto
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

  // apre il dialog per la registrazione, non compio azioni perchè dovrò attendere che l'utente confermi la mail
  openDialogReg() {
    if (!this.authService.isLogged()){
      this.dialog.open(RegistrationDialogComponent);
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
    // se il form è corretto e il backend mi torna un jwt lo salvo ne local storage tramite l'auth service,
    // così da rimanere loggato e allegarlo tramite il proxy di angular ad ogni richiesta
    // mostro un messaggio di errore se username o password non sono validi
    // o il server ha mandato un altro mesaggio di errore
    this.service.login(this.usernameValidator.value, this.passwordValidator.value)
      .subscribe(
        data => {
          this.service.setJwt(data.token);
          this.dialogRef.close();
        },
        error => error.status === 401 ?
          this.labelValue = 'Username o password non validi' : this.labelValue = 'Si è verificato un errore'
      );
  }

}

import { Component, OnInit } from '@angular/core';
import {FormControl, PatternValidator, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registrationDialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnInit {
  nameValidator = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
  surnameValidator = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]);
  idValidator = new FormControl('', [Validators.required, Validators.pattern('[sSdD][0-9]{6}')]);
  passwordValidator = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]);
  emailValidator = new FormControl('', [Validators.required, Validators.email, Validators.pattern('[sSdD][0-9]{6}@((polito\\.it)|(studenti\\.polito\\.it))')]);
  hide = true;

  labelValue: string;

  constructor(private service: AuthService) {
  }

  getNameErrorMessage() {
    if (this.nameValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.nameValidator.hasError('minlength') || this.nameValidator.hasError('maxlength')
      ? 'Lunghezza nome non valida.' : '';
  }

  getSurnameErrorMessage() {
    if (this.surnameValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.surnameValidator.hasError('minlength') || this.surnameValidator.hasError('maxlength')
      ? 'Lunghezza cognome non valida.' : '';
  }

  getIdErrorMessage() {
    return this.idValidator.hasError('required') || this.idValidator.hasError('pattern')
      ? 'Matricola non valida.' : '';
  }

  getEmailErrorMessage() {
    if (this.emailValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    if (this.emailValidator.hasError('email')) {
      return 'Email non valida.';
    }
    return this.emailValidator.hasError('pattern') ? 'Indirizzo email non abilitato.' : '';
  }

  getPasswordErrorMessage() {
    console.log(this.passwordValidator.hasError('minlength'));
    if (this.passwordValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    if (this.passwordValidator.hasError('minlength')) {
      return 'La password deve essere lunga almeno 8 caratteri.';
    }
    return this.passwordValidator.hasError('maxLength') ? 'Password non valida.' : '';
  }

  login(){
    // this.service.login(this.usernameValidator.value, this.passwordValidator.value)
    //   .subscribe(s
    //     data => {
    //       this.service.setJwt(data.accessToken);
    //       this.dialogRef.close();
    //     },
    //     error => error.status === 400 ?
    //       this.labelValue = 'Username or password not valid' : this.labelValue = 'An error has occurred'
    //   );
  }

  ngOnInit(): void {
  }

}

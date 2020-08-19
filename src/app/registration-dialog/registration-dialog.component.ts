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

  labelValue: string;

  constructor(private service: AuthService) {
  }

  getNameErrorMessage() {
    if (this.nameValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.nameValidator.hasError('minLength') || this.nameValidator.hasError('maxLength')
      ? 'Lunghezza nome non valida.' : '';
  }

  getSurnameErrorMessage() {
    if (this.surnameValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.surnameValidator.hasError('minLength') || this.surnameValidator.hasError('maxLength')
      ? 'Lunghezza cognome non valida.' : '';
  }

  getIdErrorMessage() {
    return this.surnameValidator.hasError('required') || this.surnameValidator.hasError('pattern')
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
    if (this.passwordValidator.hasError('required')) {
      return 'You must enter a value';
    }
    return this.passwordValidator.hasError('maxLength') ? 'Not a valid email' : '';
  }

  login(){
    // this.service.login(this.usernameValidator.value, this.passwordValidator.value)
    //   .subscribe(
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

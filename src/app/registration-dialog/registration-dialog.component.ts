import { Component, OnInit } from '@angular/core';
import {FormControl, PatternValidator, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {MatSnackBar} from "@angular/material/snack-bar";

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
  hide = true;
  emailValue = '';

  labelValue: string;

  constructor(private service: AuthService,
              private dialogRef: MatDialogRef<RegistrationDialogComponent>,
              private snackBar: MatSnackBar,) {
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

  fillEmail(){
    const id = this.idValidator.value;

    if (id.length > 0){
      switch (id[0]) {
        case 's':
          this.emailValue = id + '@studenti.polito.it';
          break;
        case 'd':
          this.emailValue = id + '@polito.it';
          break;
        default:
          this.emailValue = '';
      }
    } else { this.emailValue = ''; }
  }

  getIdErrorMessage() {
    return this.idValidator.hasError('required') || this.idValidator.hasError('pattern')
      ? 'Matricola non valida.' : '';
  }

  // getEmailErrorMessage() {
  //   if (this.emailValidator.hasError('required')) {
  //     return 'Devi inserire un valore.';
  //   }
  //   if (this.emailValidator.hasError('email')) {
  //     return 'Email non valida.';
  //   }
  //   return this.emailValidator.hasError('pattern') ? 'Indirizzo email non abilitato.' : '';
  // }

  getPasswordErrorMessage() {
    if (this.passwordValidator.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    if (this.passwordValidator.hasError('minlength')) {
      return 'La password deve essere lunga almeno 8 caratteri.';
    }
    return this.passwordValidator.hasError('maxLength') ? 'Password non valida.' : '';
  }

  register(){
    // todo: se qualcuno ha un errore non effettuare registrazione
    if (
      this.idValidator.invalid ||
      this.surnameValidator.invalid ||
      this.nameValidator.invalid ||
      this.passwordValidator.invalid) {
      this.labelValue = 'Completa correttamente tutti i campi.';
      return;
    }
    this.service.register(
      this.idValidator.value,
      this.surnameValidator.value,
      this.nameValidator.value,
      this.passwordValidator.value,
      this.emailValue)
      .subscribe(
        () => {
          this.snackBar.open('Registrazione effettuata. Effettua il login.', 'Chiudi');
          this.dialogRef.close();
        },
        error => {
          console.log(error);
          error.status === 409 ?
            this.labelValue = 'Utente già registrato.' : this.labelValue = 'Si è verificato un errore.'
        }
      );
  }

  ngOnInit(): void {
  }

}

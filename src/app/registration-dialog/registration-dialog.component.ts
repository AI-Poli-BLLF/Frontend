import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  PatternValidator,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-registration',
  templateUrl: './registrationDialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent implements OnDestroy {

  sub: Subscription;
  hide = true;
  emailValue = '';
  labelValue: string;
  formGroup: FormGroup;

  constructor(private service: AuthService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<RegistrationDialogComponent>,
              private snackBar: MatSnackBar) {
    this.formGroup = fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      id: ['', [Validators.required, Validators.pattern('[sSdD][0-9]{6}')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255),
        RegistrationDialogComponent.matchValues('password')]]
    });
    this.sub = this.formGroup.controls.password.valueChanges.subscribe(() => {
      this.formGroup.controls.confirmPassword.updateValueAndValidity();
    });
  }

  public static matchValues(matchTo: string) // name of the control to match to
    : (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
      !!control.parent.value &&
      control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

  checkPasswords() {
    const pass = this.formGroup.get('password').value;
    const confirmPass = this.formGroup.get('confirmPassword').value;
    return pass !== confirmPass;
  }

  getNameErrorMessage() {
    if (this.formGroup.controls.firstName.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.firstName.hasError('minlength')
    || this.formGroup.controls.firstName.hasError('maxlength')
      ? 'Lunghezza nome non valida.' : '';
  }

  getSurnameErrorMessage() {
    if (this.formGroup.controls.lastName.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    return this.formGroup.controls.lastName.hasError('minlength')
    || this.formGroup.controls.lastName.hasError('maxlength')
      ? 'Lunghezza cognome non valida.' : '';
  }

  fillEmail(){
    const id = this.formGroup.controls.id.value;

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
    return this.formGroup.controls.id.hasError('required')
    || this.formGroup.controls.id.hasError('pattern')
      ? 'Matricola non valida.' : '';
  }

  getPasswordErrorMessage() {
    if (this.formGroup.controls.password.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    if (this.formGroup.controls.password.hasError('minlength')) {
      return 'La password deve essere lunga almeno 8 caratteri.';
    }
    return this.formGroup.controls.password.hasError('maxLength') ? 'Password non valida.' : '';
  }

  getCheckPasswordErrorMessage() {
    if (this.formGroup.controls.confirmPassword.hasError('required')) {
      return 'Devi inserire un valore.';
    }
    if (this.formGroup.controls.confirmPassword.hasError('minlength')) {
      return 'La password deve essere lunga almeno 8 caratteri.';
    }
    if (this.checkPasswords()){
      return 'Le password non corrispondono.';
    }
    return this.formGroup.controls.confirmPassword.hasError('maxLength') ? 'Password non valida.' : '';
  }

  public checkError(controlName: string): boolean {
    return this.formGroup.controls[controlName].invalid;
  }

  register(){
    if (this.formGroup.invalid) {
      this.labelValue = 'Completa correttamente tutti i campi.';
      return;
    }
    this.service.register(
      this.formGroup.controls.id.value,
      this.formGroup.controls.lastName.value,
      this.formGroup.controls.firstName.value,
      this.formGroup.controls.password.value,
      this.emailValue)
      .subscribe(
        data => {
          console.log(data);
          this.snackBar.open('Registrazione effettuata. Verifica l\'indirizzo mail per effettuare il login.', 'Chiudi');
          this.dialogRef.close();
        },
        error => {
          console.log(error);
          error.status === 409 ?
            this.labelValue = 'Utente già registrato.' : this.labelValue = 'Si è verificato un errore.';
        }
      );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}


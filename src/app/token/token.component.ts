import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TokenService} from "../services/token.service";

@Component({
  selector: 'app-token',
  template: '<h1>Verifica Token</h1>',
  styleUrls: []
})
// componente accessibile liberamente che si occupa di effetturare una post sul backend
// del token ricevuto nella route, una volta effettuata la post effettua un reindirizzamento sulla /
// è utilizzato per la verifica della mail
export class TokenComponent implements OnDestroy{
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private tokenService: TokenService) {
    console.log('TOKEN CHECK');
    this.sub = this.route.params.subscribe(params => {
      this.doPost(params.token);
    });
  }

  doPost(token: string){
    // console.log('TOKEN: ', token);
    this.tokenService.verify(token)
      .subscribe(
        () => {
          this.snackBar.open('Verifica email effettuata', 'Chiudi');
          this.redirect();
        },
        error => {
          console.log(error);
          this.snackBar.open('Errore verifica email', 'Chiudi');
          this.redirect();
        }
      );
  }

  redirect(){
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

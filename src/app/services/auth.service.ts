import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080/authenticate';

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<any>{
    const v = { email, password};
    return this.httpClient.post(this.url, v);
  }

  isLogged(): boolean{
    const jwt = localStorage.getItem('jwt');
    if (jwt == null){
      return false;
    }
    const d = new Date();
    const jwtParse = JSON.parse(atob(jwt.split('.')[1]));
    if (d.getTime() / 1000 > jwtParse.exp){
      localStorage.removeItem('jwt');
      return false;
    }
    return true;
  }

  getJwt(): string{
    return localStorage.getItem('jwt');
  }

  setJwt(token: string): void{
    localStorage.setItem('jwt', token);
  }

  removeJwt(): void{
    localStorage.removeItem('jwt');
  }

}

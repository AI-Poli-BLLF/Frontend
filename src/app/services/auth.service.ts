import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host = 'https://localhost:4200';
  private url = this.host + '/authenticate';
  private urlRegister = this.host + '/register';

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<any>{
    const v = { username, password};
    return this.httpClient.post(this.url, v);
  }

  register(userId: string, firstName: string, name: string, password: string, email: string): Observable<any>{
    const v = { userId, firstName, name, email, password};
    // console.log(v);
    return this.httpClient.post(this.urlRegister, v);
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

  getRole(){
    if (!this.isLogged()) {
      return '';
    }
    const jwt = localStorage.getItem('jwt');
    const jwtParse = JSON.parse(atob(jwt.split('.')[1]));
    return jwtParse.roles[0];
  }

  getId(){
    if (!this.isLogged()) {
      return '';
    }
    const jwt = localStorage.getItem('jwt');
    const jwtParse = JSON.parse(atob(jwt.split('.')[1]));
    return jwtParse.sub.split('@')[0];
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

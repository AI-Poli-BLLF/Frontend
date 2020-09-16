import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private url = 'https://localhost:4200/notification/confirm-registration';

  constructor(private httpClient: HttpClient) { }

  verify(token: string): Observable<any>{
    return this.httpClient.post(this.url, token);
  }

}

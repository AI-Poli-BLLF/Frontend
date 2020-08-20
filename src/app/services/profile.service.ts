import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Profile} from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url = 'https://localhost:4200/API/me';
  private baseUrl = 'https://localhost:4200/API';

  constructor(private httpClient: HttpClient) {
  }

  get(): Observable<Profile> {
    return this.httpClient.get<Profile>(this.url)
      .pipe(
        map(s => new Profile(s.id, s.name, s.firstName, s.email, s.roles)),
        catchError(err => {
          console.error(err);
          return throwError('ProfileService get error: ' + err.message);
        }));
  }

  getPhotoPath(role: string, id: string): string {
    switch (role) {
      case 'ROLE_PROFESSOR':
        return this.baseUrl + '/professors/' + id + '/photo';
      case 'ROLE_STUDENT':
        return this.baseUrl + '/students/' + id + '/photo';
      default:
        return 'assets/img/blank-profile-picture-973460.svg';
    }
  }

  getPhoto(role: string, id: string): Observable<any> {
    const path = this.getPhotoPath(role, id);
    return this.httpClient.get(path,  { responseType: 'blob' });
      // .pipe(
      //   map(e => URL.createObjectURL(e)),
      //   catchError(err => {
      //     console.error(err);
      //     return throwError('ProfileService getImg error: ' + err.message);
      //   })
      // );
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, of, throwError} from 'rxjs';
import {NotificationToken, NotificationType} from '../models/notification-token.model';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationUrl = 'https://localhost:4200/notification';

  constructor(private httpClient: HttpClient, private auth: AuthService) {}

  getNotification(): Observable<Array<NotificationToken>>{
    const url = `${this.notificationUrl}/${this.auth.getId()}`;

    return this.httpClient.get<Array<NotificationToken>>(url).pipe(
      catchError( err => {
        console.error(err);
        return throwError(err);
      }),
      map(tokens => tokens.map(t => new NotificationToken(
        t.id, t.senderId, t.courseName, t.message,
        t.notificationRead, t.type, t.creation
      )))
    );
  }

  acceptRequest(token: NotificationToken){
    let url: string;
    switch (token.type){
      case NotificationType.PROFESSOR_COOPERATION:
        url = `${this.notificationUrl}/accept-cooperation`;
        break;
      case NotificationType.STUDENT_ENROLLING:
        url = `${this.notificationUrl}/accept-enrolling-request`;
        break;
      default:
        return of(null);
    }

    return this.httpClient.post(url, token.id).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  rejectRequest(token: NotificationToken){
    let url: string;
    switch (token.type){
      case NotificationType.PROFESSOR_COOPERATION:
        url = `${this.notificationUrl}/reject-cooperation`;
        break;
      case NotificationType.STUDENT_ENROLLING:
        url = `${this.notificationUrl}/reject-enrolling-request`;
        break;
      default:
        return of(null);
    }

    return this.httpClient.post(url, token.id).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  readNotification(token: NotificationToken){
    const url = `${this.notificationUrl}/read-notification`;
    return this.httpClient.put(url, token.id).pipe(
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }
}

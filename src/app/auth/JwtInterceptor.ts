import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isLogged()) {
      const token = this.authService.getJwt();
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }});
    }
    return next.handle(req);
  }

}

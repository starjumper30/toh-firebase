import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private afAuth: AngularFireAuth) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.afAuth.idToken
      .pipe(
        switchMap(idToken => {
          return next.handle(req.clone({
            setHeaders: {
              Authorization: `Bearer ${idToken}`
            }
          }));
        })
      );
  }
}

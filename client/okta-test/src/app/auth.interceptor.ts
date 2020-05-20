import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oktaAuth: OktaAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const allowedOrigins = [
      'http://localhost:33400/', //jobs
      'http://localhost:1068/',  //flashcode
      'http://localhost:2137/',  //pcr-radio
      'http://localhost:1070/',  //administration
      'https://localhost:44382',
      `${this.oktaAuth.getOktaConfig().issuer}/v1/userinfo`
    ];
    if (allowedOrigins.some(url => request.urlWithParams.includes(url))) {

      const accessToken = await this.oktaAuth.getAccessToken();
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return next.handle(request).toPromise();
  }
}
import { Injectable } from '@angular/core';
import { OktaAuthService, UserClaims } from '@okta/okta-angular'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthUserInfoService {

  constructor(private http: HttpClient, private oktaAuthService: OktaAuthService) {}

  getUserInfo(): Observable<any> {
    const url = `${this.oktaAuthService.getOktaConfig().issuer}/v1/userinfo`;
    return this.http.get(url);
  }
}

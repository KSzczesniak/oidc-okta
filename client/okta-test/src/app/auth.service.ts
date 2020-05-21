import { Injectable } from '@angular/core';
import { OktaAuthService, OktaConfig } from '@okta/okta-angular'
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { UserClaims } from './userClaims.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;
  userClaims: UserClaims;
  private subjects = {
    'cms-admins': new BehaviorSubject(false),
    'cms-users': new BehaviorSubject(false),
    'depot-admins': new BehaviorSubject(false),
    'depot-users': new BehaviorSubject(false),
    'codeplug-requirement-admins': new BehaviorSubject(false),
    'codeplug-requirement-users': new BehaviorSubject(false)
  };

  isCmsAdminChanges$ = this.subjects['cms-admins'].asObservable();
  isCmsUserChanges$ = this.subjects['cms-users'].asObservable();
  isDepotAdminChanges$ = this.subjects['depot-admins'].asObservable();
  isDepotUserChanges$ = this.subjects['depot-users'].asObservable();
  isCodeplugRequirementAdminChanges$ = this.subjects['codeplug-requirement-admins'].asObservable();
  isCodeplugRequirementUserChanges$ = this.subjects['codeplug-requirement-users'].asObservable();


  constructor(private http: HttpClient, private oktaAuthService: OktaAuthService) {
    this.oktaAuthService.$authenticationState.subscribe(async isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (!this.isAuthenticated) {
        this.resetUserGroupMembership();
        return;
      }
      this.userClaims = await this.getUser();
      Object.entries(this.subjects).forEach(([k, v]) => {
        if (this.isGroupMember(k) && !v.value) {
          v.next(true);
        }
        else if (!this.isGroupMember(k) && v.value) {
          v.next(false);
        }
      });
      
    })
  }

  get authenticationState$ (): Observable<boolean> {
    return this.oktaAuthService.$authenticationState;
  }

  isGroupMember(groupName: string): boolean {
    return this.userClaims?.groups?.some(g => g === groupName);
  }

  private resetUserGroupMembership(): void {
    Object.values(this.subjects)
      .filter(subject => subject.value)
      .forEach(subject => subject.next(false))
  }
  get isAuhenticated(): boolean {
    return this.isAuthenticated;
  }
  // isAuthenticated(): Promise<boolean> {
  //   return this.oktaAuthService.isAuthenticated();
  // }

  getAccessToken(): Promise<string | undefined> {
    return this.oktaAuthService.getAccessToken();
  }

  getIdToken(): Promise<string | undefined> {
    return this.oktaAuthService.getIdToken();
  }

  getUser(): Promise<UserClaims | undefined> {
    return this.oktaAuthService.getUser();
  }

  getOktaConfig(): OktaConfig {
    return this.oktaAuthService.getOktaConfig();
  }

  loginRedirect(fromUri?: string, additionalParams?: object): any {
    return this.oktaAuthService.loginRedirect(fromUri, additionalParams);
  }

  logout(options?: any): Promise<void> {
    return this.oktaAuthService.logout(options);
  }

  getUserInfo(): Observable<UserClaims> {
    const url = `${this.oktaAuthService.getOktaConfig().issuer}/v1/userinfo`;
    return this.http.get<UserClaims>(url);
  }
}

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
    'cms-admin': new BehaviorSubject(false),
    'cms-user': new BehaviorSubject(false),
    'depot-admin': new BehaviorSubject(false),
    'depot-user': new BehaviorSubject(false),
    'codeplug-requirement-admin': new BehaviorSubject(false),
    'codeplug-requirement-user': new BehaviorSubject(false)
  };

  isCmsAdminChanges$ = this.subjects['cms-admin'].asObservable();
  isCmsUserChanges$ = this.subjects['cms-user'].asObservable();
  isDepotAdminChanges$ = this.subjects['depot-admin'].asObservable();
  isDepotUserChanges$ = this.subjects['depot-user'].asObservable();
  isCodeplugRequirementAdminChanges$ = this.subjects['codeplug-requirement-admin'].asObservable();
  isCodeplugRequirementUserChanges$ = this.subjects['codeplug-requirement-user'].asObservable();


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

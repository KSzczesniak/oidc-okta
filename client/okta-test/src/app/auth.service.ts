import { Injectable } from '@angular/core';
import { OktaAuthService, OktaConfig } from '@okta/okta-angular'
import { Observable, BehaviorSubject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { UserClaims } from './userClaims.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userClaims: UserClaims;
  
  private allowedFeatures = {
    home: false,
    depot: false,
    depotAdministration: false,
    codeplugRepository: false,
    codeplugRequirement: false,
    codeplugRequirementAdministration: false,
    flashcodeManagement: false,
    flashcodeManagementAdministration: false,
  };

  private allowedFeaturesToUserGroup = {
    depot: ['depot-users', 'depot-admins'],
    depotAdministration: ['depot-admins'],
    codeplugRepository: ['cms-users', 'cms-admins'],
    codeplugRequirement: [''],
    codeplugRequirementAdministration: [''],
    flashcodeManagement: ['cms-users', 'cms-admins'],
    flashcodeManagementAdministration: ['cms-admins']
  };

  private allowedFeaturesChangesSource = new BehaviorSubject(this.allowedFeatures);
  allowedFeaturesChanges$ = this.allowedFeaturesChangesSource.asObservable();

  constructor(private http: HttpClient, private oktaAuthService: OktaAuthService) {}

  public async setAllowedFeatures(isAuthenticated: boolean) {
    if (! isAuthenticated) {
      Object.keys(this.allowedFeatures).forEach(f => this.allowedFeatures[f] = false);
    } else {
      this.allowedFeatures.home = true;
      this.userClaims = await this.getUser();
      Object.entries(this.allowedFeaturesToUserGroup).forEach(([feature, groups]) => {
        this.allowedFeatures[feature] = groups.some(g => this.isGroupMember(g))
      });
    }
    this.allowedFeaturesChangesSource.next(this.allowedFeatures);
  }

  get authenticationState$ (): Observable<boolean> {
    return this.oktaAuthService.$authenticationState;
  }

  isGroupMember(groupName: string): boolean {
    // console.log(groupName)
    // console.log(this.userClaims?.groups)
    return this.userClaims?.groups?.some(g => g === groupName);
  }

  async isAuthenticated(): Promise<boolean> {
    const isAuthenticated =  await this.oktaAuthService.isAuthenticated();
    await this.setAllowedFeatures(isAuthenticated);
    return isAuthenticated;
  }

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
    console.log('get info')
    return this.http.get<UserClaims>(url);
  }
}

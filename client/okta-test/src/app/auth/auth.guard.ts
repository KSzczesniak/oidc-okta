import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    if (!authenticated) {
      this.authService.login(state.url);
      return false;
    }
    
    const featureAllowed = this.authService.isFeatureAllowed(route.data.featureName);
    if (featureAllowed) {
      return true;
    }
    return false;
  }
  
}

import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'okta-test';
  isAuthenticated = false;

  constructor(public authService: AuthService) {
    this.authService.authenticationState$.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
    this.authService.isCmsAdminChanges$.subscribe
  }
  async ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated;
  }
  login() {
    this.authService.loginRedirect();
  }
  logout() {
    this.authService.logout();
  }
}

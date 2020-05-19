import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'okta-test';

  isAuthenticated: boolean;
  constructor(public oktaAuth: OktaAuthService) {
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }
  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }
  login() {
    this.oktaAuth.loginRedirect();
  }
  logout() {
    this.oktaAuth.logout();
  }
}

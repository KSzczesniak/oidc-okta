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
  allowedFeatures: { [key: string]: boolean } = {};

  constructor(public authService: AuthService) {}

  async ngOnInit() {
    this.isAuthenticated = await this.authService.isAuthenticated();
    this.authService.allowedFeaturesChanges$.subscribe(allowedFeatures => {
      this.allowedFeatures = allowedFeatures;
      console.log(allowedFeatures);
    });
  }
  login() {
    this.authService.loginRedirect();
  }
  logout() {
    this.authService.logout();
  }
}

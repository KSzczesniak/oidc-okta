import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { AuthUserInfoService } from '../auth-user-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(
    private oktaAuth: OktaAuthService, 
    private authUserInfoService: AuthUserInfoService) { }

  async ngOnInit() {
    const idT = await this.oktaAuth.getIdToken();
    const acT = await this.oktaAuth.getAccessToken();
    const userClaims = await this.oktaAuth.getUser();
    this.authUserInfoService.getUserInfo().subscribe(userInfo => {
      const userClaims2 = userInfo;
      console.log(userClaims2)
    });
    console.log(idT);
    console.log(acT);
    console.log(userClaims)
  }

}

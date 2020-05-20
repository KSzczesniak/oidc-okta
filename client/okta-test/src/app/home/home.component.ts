import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private http: HttpClient) { }

  async ngOnInit() {
    const idT = await this.authService.getIdToken();
    const acT = await this.authService.getAccessToken();
    const userClaims = await this.authService.getUser();
    this.authService.getUserInfo().subscribe(userInfo => {
      const userClaims2 = userInfo;
      console.log(userClaims2)

    });
    console.log(idT);
    console.log(acT);
    console.log(userClaims)
  }

  
  onClick() {
    console.log('request sent')
    const res = this.http.get("https://localhost:44382/api/values").subscribe(res => console.log(res));
  }
  
  onClick2() {
    console.log('request sent')
    const res = this.http.get("https://localhost:44382/api/values/new").subscribe(res => console.log(res));
  }
  

}

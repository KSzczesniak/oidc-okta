import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import {
  OktaAuthModule,
  OKTA_CONFIG,
} from '@okta/okta-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './auth.interceptor';

const config = {
  issuer: 'https://motorolasolutions38.okta.com/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '0oaclnseeHR3IXRXE4x6',
  pkce: false,
  scopes: ['openid', 'profile', 'groups']
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OktaAuthModule,
    NgbModule,
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: config },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

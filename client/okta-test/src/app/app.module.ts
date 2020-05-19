import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  OktaAuthModule,
  OKTA_CONFIG,
} from '@okta/okta-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const config = {
  issuer: 'https://motorolasolutions38.okta.com/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '0oaclnseeHR3IXRXE4x6',
  pkce: true,
  scopes: ['openid', 'profile', 'email']
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OktaAuthModule,
    NgbModule
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: config },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

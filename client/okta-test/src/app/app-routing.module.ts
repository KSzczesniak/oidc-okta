import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthenticatedHomeComponent } from './authenticated-home/authenticated-home.component';
import { DepotComponent } from './depot/depot.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'authenticated-home',
    component: AuthenticatedHomeComponent,
    canActivate: [ OktaAuthGuard ],
  },
  {
    path: 'depot',
    component: DepotComponent,
    canActivate: [ AuthGuard ],
    data: {featureName: "depot"}
  },
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 
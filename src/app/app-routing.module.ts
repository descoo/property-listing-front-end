import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertsComponent } from './components/adverts/adverts.component';
import { CreateEditAdvertComponent } from './components/create-edit-advert/create-edit-advert.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './gaurds/auth.guard';
import { MyAdvertsGuard } from './guards/my-adverts.guard';

const routes: Routes = [
  { path: 'salary-list', component: HomeComponent },
  { path: 'add', component: CreateEditAdvertComponent },
  { path: 'edit/:id', component: CreateEditAdvertComponent },
  {
    path: 'adverts',
    component: AdvertsComponent,
    canActivate: [MyAdvertsGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

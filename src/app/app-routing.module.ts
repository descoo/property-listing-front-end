import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { AdvertDetailComponent } from './components/advert-detail/advert-detail.component';
import { AdvertManagementComponent } from './components/advert-management/advert-management.component';
import { AdvertsComponent } from './components/adverts/adverts.component';
import { CreateEditAdvertComponent } from './components/create-edit-advert/create-edit-advert.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { HomeComponent } from './components/home/home.component';
import { HomesForSaleComponent } from './components/homes-for-sale/homes-for-sale.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search/search.component';
import { SellerProfileComponent } from './components/seller-profile/seller-profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { MyAdvertsGuard } from './guards/my-adverts.guard';

const routes: Routes = [
  { path: 'homes-for-sale', component: HomesForSaleComponent },
  { path: 'search', component: SearchComponent },
  { path: 'homes-for-sale/:id', component: AdvertDetailComponent },
  { path: 'account', component: AccountPageComponent },
  { path: 'seller-profile', component: SellerProfileComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'advert-management', component: AdvertManagementComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'adverts',
    component: AdvertsComponent,
    canActivate: [MyAdvertsGuard],
  },
  { path: 'add', component: CreateEditAdvertComponent },
  { path: 'edit/:id', component: CreateEditAdvertComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

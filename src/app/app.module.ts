import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgProgressModule } from 'ngx-progressbar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AppRoutingModule } from './app-routing.module';
import { SwiperModule } from 'swiper/angular';

import { AppComponent } from './app.component';
import { InMemoryDataService } from './services/in-memory-data.service';
import { HeaderComponent } from './shared/header/header.component';
import { SubHeaderComponent } from './shared/sub-header/sub-header.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvertsComponent } from './components/adverts/adverts.component';
import { CreateEditAdvertComponent } from './components/create-edit-advert/create-edit-advert.component';
import { HomesForSaleComponent } from './components/homes-for-sale/homes-for-sale.component';
import { SearchComponent } from './components/search/search.component';
import { ContactSellerComponent } from './components/contact-seller/contact-seller.component';
import { AdvertDetailComponent } from './components/advert-detail/advert-detail.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { SellerProfileComponent } from './components/seller-profile/seller-profile.component';
import { FeaturedComponent } from './components/featured/featured.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdvertManagementComponent } from './components/advert-management/advert-management.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SubHeaderComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AdvertsComponent,
    CreateEditAdvertComponent,
    HomesForSaleComponent,
    SearchComponent,
    AdvertDetailComponent,
    ContactSellerComponent,
    AccountPageComponent,
    SellerProfileComponent,
    FeaturedComponent,
    FavouritesComponent,
    UserManagementComponent,
    AdvertManagementComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    ReactiveFormsModule,
    FormsModule,
    NgProgressModule,
    SweetAlert2Module.forRoot(),
    SwiperModule,
    FontAwesomeModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

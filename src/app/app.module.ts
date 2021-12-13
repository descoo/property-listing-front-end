import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgProgressModule } from 'ngx-progressbar';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { InMemoryDataService } from './services/in-memory-data.service';
import { HeaderComponent } from './shared/header/header.component';
import { SubHeaderComponent } from './shared/sub-header/sub-header.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdvertsComponent } from './components/adverts/adverts.component';
import { CreateEditAdvertComponent } from './components/create-edit-advert/create-edit-advert.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    ReactiveFormsModule,
    NgProgressModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

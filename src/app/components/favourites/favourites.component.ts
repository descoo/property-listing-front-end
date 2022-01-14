import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { Ad } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FavouritesService } from 'src/app/services/favourites.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit, OnDestroy {
  adverts!: Ad[];
  sub!: Subscription;
  currentUserName!: string;
  constructor(
    private router: Router,
    private favouritesService: FavouritesService,
    public progressBarService: ProgressbarService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserName();
    this.getAdverts();
  }

  getCurrentUserName(): void {
    this.sub = this.auth.currentUser$.subscribe(
      (user) => (this.currentUserName = user.name)
    );
  }

  getAdverts(): void {
    this.progressBarService.startLoading();
    (this.sub = this.favouritesService
      .getFavouriteAds()
      .pipe(map((ad) => ad.filter((ad) => ad.likedBy === this.currentUserName)))
      .subscribe((ads) => {
        this.adverts = ads;
        console.log(this.adverts);
        this.success();
      })),
      () => this.error();
  }

  deleteAdvert(id: number | null): void {
    this.progressBarService.startLoading();
    (this.sub = this.favouritesService
      .removeFromFavourites(id)
      .subscribe(() => {
        const newAds = this.adverts.filter((ad) => ad.id !== id);
        this.adverts = newAds;
        this.success();
      })),
      () => this.error();
  }

  goToAdvertDetails(id: number | null): void {
    this.router.navigate(['/homes-for-sale', id]);
  }

  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
    displayMessage('error', 'Oops something went wrong!');
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

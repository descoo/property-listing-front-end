import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { Ad } from 'src/app/models/user.model';
import { FavouritesService } from 'src/app/services/favourites.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit {
  adverts!: Ad[];
  filteredAds!: Ad[];
  constructor(
    private router: Router,
    private favouritesService: FavouritesService,
    public progressBarService: ProgressbarService
  ) {}

  ngOnInit(): void {
    this.getAdverts();
  }

  getAdverts(): void {
    this.progressBarService.startLoading();
    this.favouritesService.getFavouriteAds().subscribe((ads) => {
      this.adverts = ads;
      this.filteredAds = ads;
      this.success();
    }),
      () => this.error();
  }

  deleteAdvert(id: number | null): void {
    this.progressBarService.startLoading();
    this.favouritesService.removeFromFavourites(id).subscribe(() => {
      const newAds = this.filteredAds.filter((ad) => ad.id !== id);
      this.filteredAds = newAds;
      this.success();
    }),
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
}

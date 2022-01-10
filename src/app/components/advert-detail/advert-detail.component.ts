import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { Ad } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { FavouritesService } from 'src/app/services/favourites.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

@Component({
  selector: 'app-advert-detail',
  templateUrl: './advert-detail.component.html',
  styleUrls: ['./advert-detail.component.css'],
})
export class AdvertDetailComponent implements OnInit, OnDestroy {
  id!: number;
  ad: Ad | undefined;
  sub!: Subscription;

  constructor(
    private advertsService: AdvertsService,
    private favouritesService: FavouritesService,
    private route: ActivatedRoute,
    public progressBarService: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAdvert();
  }

  getAdvert(): void {
    this.getPassedId();
    this.progressBarService.startLoading();
    this.sub = this.advertsService.getSingleAdvert(this.id).subscribe(
      (ad) => {
        this.success();
        this.ad = ad;
      },
      () => {
        this.error();
        displayMessage(
          'error',
          'Oops something went wrong! Redirecting to Homes for sale'
        );
        this.router.navigate(['/homes-for-sale']);
      }
    );
  }

  getPassedId(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = Number(id);
  }

  addAdToFavorites(ad: Ad): void {
    this.progressBarService.startLoading();
    this.sub = this.favouritesService.addAdToFavorites(ad).subscribe((ad) => {
      if (Object.keys(ad).length > 0) {
        this.success();
        displayMessage('success', 'Advert added successfully!');
      } else {
        this.error();
        displayMessage(
          'error',
          'You Cannot add your own advert to your favourites'
        );
      }
    });
  }

  // UI functions
  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.completeLoading();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

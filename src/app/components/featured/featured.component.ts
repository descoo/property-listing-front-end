import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { displayMessage } from 'src/app/helpers/helperFuncs';
import { Ad } from 'src/app/models/user.model';
import { FeaturedService } from 'src/app/services/featured.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css'],
})
export class FeaturedComponent implements OnInit, OnDestroy {
  adverts!: Ad[];
  sub!: Subscription;

  constructor(
    private featuredService: FeaturedService,
    public progressBarService: ProgressbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAdverts();
  }

  getAdverts(): void {
    this.progressBarService.startLoading();
    this.sub = this.featuredService.getFeaturedAdverts().subscribe((ads) => {
      this.adverts = ads;
      this.adverts.sort((a: Ad, b: Ad) => {
        if (b.id && a.id) {
          return b.id - a.id;
        }
        return b.price - a.price;
      });
      this.success();
    });
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
    displayMessage(
      'error',
      'Oops something went wrong! could not load featured list'
    );
  }

  options = {
    slidesPerView: 1,
    navigation: true,
    breakpoints: {
      960: {
        slidesPerView: 2,
      },
    },
  };

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  displayCustomMessage,
  displayMessage,
} from 'src/app/helpers/helperFuncs';
import { Ad } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { FeaturedService } from 'src/app/services/featured.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css'],
})
export class AdvertsComponent implements OnInit, OnDestroy {
  adverts$!: Observable<Ad[]>;
  selectedId!: number | null;
  ishidden: boolean = true;
  sub!: Subscription;

  constructor(
    private router: Router,
    private advertsService: AdvertsService,
    public progressBarService: ProgressbarService,
    private featureService: FeaturedService
  ) {}

  ngOnInit(): void {
    this.getAdverts();
  }

  getAdverts(): void {
    this.progressBarService.startLoading();
    this.adverts$ = this.advertsService.getCurrentUserAdverts().pipe(
      catchError(() => {
        this.error();
        return EMPTY;
      })
    );
    setTimeout(() => this.success(), 2000);
  }

  feature(ad: Ad): void {
    if (ad.featuredStatus) {
      displayCustomMessage('Advert already featured', 2000);
      return;
    }
    this.sub = this.featureService.adToFeatured(ad).subscribe(
      (ad) => {
        console.log(ad);
        displayMessage('success', 'Advert updated successfully');
      },
      () => {
        displayMessage('error', 'Oops something went wrong!');
      }
    );
  }

  goToEdit(): void {
    console.log(this.selectedId);
    this.router.navigate(['/edit', this.selectedId]);
  }

  togglehideAdvert(ad: Ad): void {
    this.sub = this.advertsService.toggleHide(ad).subscribe();
  }

  deleteAdvert(ad: Ad): void {
    Swal.fire({
      title: 'Are you sure you want to delete this advert?',
      text: 'This action cannot be undone, are you sure you want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, Keep it!',
    }).then((confirmed: { isConfirmed: boolean }) => {
      if (confirmed.isConfirmed) {
        this.progressBarService.startLoading();
        this.selectedId = ad.id;
        let filteredAds!: Ad[];
        this.sub = this.adverts$.subscribe((ads) => {
          if (ads) filteredAds = ads;
          this.sub = this.advertsService.deleteAdvert(ad).subscribe(() => {
            this.adverts$ = of(
              filteredAds.filter((ad) => ad.id !== this.selectedId)
            );
            this.success();
          });
        });
      } else {
        Swal.fire('Cancelled', 'Advert not deleted!', 'success');
      }
    });
  }

  // UI functions
  toggleHideActions(id: number | null): void {
    this.selectedId = id;
    this.ishidden = !this.ishidden;
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Ad } from 'src/app/models/user.model';
import { AdvertsService } from 'src/app/services/adverts.service';
import { ProgressbarService } from 'src/app/services/progressbar.service';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css'],
})
export class AdvertsComponent implements OnInit {
  adverts!: Ad[] | undefined;
  author!: string;
  constructor(
    private router: Router,
    private advertsService: AdvertsService,
    public progressBarService: ProgressbarService
  ) {}

  ngOnInit(): void {
    this.getAdverts();
  }

  getAdverts(): void {
    this.advertsService.getUser().subscribe((user) => {
      this.author = user.name;
    });
    this.progressBarService.startLoading();
    this.advertsService
      .getAdverts()
      .pipe(
        map((ad) => {
          return ad?.filter((ad) => ad.author === this.author);
          // .filter((ad) => ad.hiddenStatus === false);
        })
      )
      .subscribe(
        (ads) => {
          this.success();
          this.adverts = ads;
        },
        () => {
          this.error();
          setTimeout(() => this.router.navigate(['/home']), 4000);
        }
      );
  }

  togglehideAdvert(ad: Ad): void {
    ad.hiddenStatus = !ad.hiddenStatus;
    this.advertsService.toggleHide(ad).subscribe();
  }

  deleteAdvert(id: number | null): void {
    console.log('delete', id);
  }

  // UI functions
  success(): void {
    this.progressBarService.setSuccess();
    this.progressBarService.completeLoading();
  }

  error(): void {
    this.progressBarService.setError();
    this.progressBarService.setShowError();
    this.progressBarService.completeLoading();
  }
}

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Ad } from '../models/user.model';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class FeaturedService {
  private featuredUrl = 'api/featured';

  constructor(private http: HttpClient) {}

  getFeaturedAdverts(): Observable<Ad[]> {
    return this.http
      .get<Ad[]>(this.featuredUrl)
      .pipe(delay(2000), catchError(this.handleError));
  }

  adToFeatured(ad: Ad): Observable<Ad> {
    const {
      likedBy,
      author,
      imgUrl,
      hiddenStatus,
      deleteStatus,
      name,
      province,
      city,
      advertDetails,
      price,
    } = ad;

    const newAd = {
      id: null,
      featuredStatus: true,
      likedBy,
      author,
      imgUrl,
      hiddenStatus,
      deleteStatus,
      name,
      province,
      city,
      advertDetails,
      price,
    };
    return this.http
      .post<Ad>(this.featuredUrl, newAd, { headers })
      .pipe(catchError(this.handleError));
  }

  removeFromFeatured(ad: Ad): Observable<{}> {
    return this.http
      .delete<Ad>(`${this.featuredUrl}/${ad.id}`, { headers })
      .pipe(delay(2000), catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errMsg = '';
    if (err.error instanceof ErrorEvent) {
      errMsg = 'An error occurred: ' + err.error.message;
    } else {
      errMsg = `Server returned code: ${err.status}, error message is: ${err.message} `;
    }
    return throwError(errMsg);
  }
}

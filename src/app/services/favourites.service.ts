import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Ad } from '../models/user.model';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private favouritesUrl = 'api/favourites';

  constructor(private http: HttpClient) {}

  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.name;
  }

  addAdToFavorites(ad: Ad): Observable<Ad> | Observable<{}> {
    const name = this.getUserName();
    if (name === ad.author) return of({});
    ad.id = null;
    ad.likedBy = name;

    return this.http
      .post<Ad>(this.favouritesUrl, ad, { headers })
      .pipe(delay(1000), catchError(this.handleError));
  }

  getFavouriteAds(): Observable<Ad[]> {
    return this.http
      .get<Ad[]>(this.favouritesUrl)
      .pipe(delay(1000), catchError(this.handleError));
  }

  removeFromFavourites(id: number | null): Observable<Ad> {
    return this.http
      .delete<Ad>(`${this.favouritesUrl}/${id}`, { headers })
      .pipe(delay(1000), catchError(this.handleError));
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

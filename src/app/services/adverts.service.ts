import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Ad, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdvertsService {
  private currentUser!: User;
  private advertUrl = 'api/adverts';

  constructor(private http: HttpClient) {}
  getUser(): Observable<User> {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return of(this.currentUser);
  }

  getAdverts(): Observable<Ad[]> {
    return this.http
      .get<Ad[]>(this.advertUrl)
      .pipe(delay(2000), catchError(this.handleError));
  }

  getSingleAdvert(id: number): Observable<Ad> {
    return this.http
      .get<Ad>(`${this.advertUrl}/${id}`)
      .pipe(delay(2000), catchError(this.handleError));
  }

  addAdvert(advert: Ad): Observable<Ad> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<Ad>(this.advertUrl, advert, { headers: headers })
      .pipe(delay(2000), catchError(this.handleError));
  }

  // toggleHide(ad: Ad): Observable<Ad> {
  //   const newStatus = (ad.hiddenStatus = !ad.hiddenStatus);
  //   ad.hiddenStatus = newStatus;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http
  //     .put<Ad>(`${this.advertUrl}/${ad.id}`, ad, { headers: headers })
  //     .pipe(delay(2000), catchError(this.handleError));
  // }

  deleteAdvert(id: number): Observable<Ad> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .delete<Ad>(`${this.advertUrl}/${id}`, { headers: headers })
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

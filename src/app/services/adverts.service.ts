import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Ad, User } from '../models/user.model';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class AdvertsService {
  private currentUser!: User;
  private advertUrl = 'api/adverts';

  constructor(private http: HttpClient) {}

  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.name;
  }

  getUser(): Observable<User> {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return of(this.currentUser);
  }

  getAllAdverts(): Observable<Ad[]> {
    return this.http
      .get<Ad[]>(this.advertUrl)
      .pipe(delay(1000), catchError(this.handleError));
  }

  getCurrentUserAdverts(): Observable<Ad[]> {
    let author!: string;
    this.getUser().subscribe((user) => {
      author = user.name;
    });
    return this.http.get<Ad[]>(this.advertUrl).pipe(
      map((ad) => ad.filter((ad) => ad.author === author)),
      delay(1000),
      catchError(this.handleError)
    );
  }

  getSingleAdvert(id: number): Observable<Ad> {
    return this.http
      .get<Ad>(`${this.advertUrl}/${id}`)
      .pipe(delay(1000), catchError(this.handleError));
  }

  addAdvert(advert: Ad): Observable<Ad> {
    const name = this.getUserName();
    advert.author = name;
    advert.hiddenStatus = false;
    advert.imgUrl = '/assets/images/house.jpg';
    return this.http
      .post<Ad>(this.advertUrl, advert, { headers })
      .pipe(catchError(this.handleError));
  }

  updateAdvert(ad: Ad): Observable<Ad> {
    return this.http
      .put<Ad>(`${this.advertUrl}/${ad.id}`, ad, { headers })
      .pipe(delay(1000), catchError(this.handleError));
  }

  toggleHide(ad: Ad): Observable<Ad> {
    ad.hiddenStatus = !ad.hiddenStatus;
    const url = `${this.advertUrl}/${ad.id}`;
    return this.http.put<Ad>(url, ad, { headers }).pipe(
      map(() => ad),
      catchError(this.handleError)
    );
  }

  deleteAdvert(ad: Ad): Observable<Ad> {
    ad.deleteStatus = !ad.deleteStatus;
    return this.http
      .put<Ad>(`${this.advertUrl}/${ad.id}`, ad, { headers })
      .pipe(catchError(this.handleError));
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

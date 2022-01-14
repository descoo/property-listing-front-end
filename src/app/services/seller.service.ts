import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Seller } from '../models/user.model';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private url: string = 'api/sellersInfo';
  constructor(private http: HttpClient) {}

  getSellers(): Observable<Seller[]> {
    return this.http
      .get<Seller[]>(this.url)
      .pipe(delay(1000), catchError(this.handleError));
  }

  addSeller(seller: Seller): Observable<Seller> {
    return this.http
      .post<Seller>(`${this.url}`, seller, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  updateSeller(seller: Seller): Observable<Seller> {
    return this.http
      .put<Seller>(`${this.url}/${seller.id}`, seller, { headers: headers })
      .pipe(
        map(() => seller),
        delay(1000),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    let errMsg = '';
    if (err.error instanceof ErrorEvent) {
      errMsg = 'An error occurred: ' + err.error.message;
    } else {
      errMsg = `Server returned code: ${err.status}, error message is: ${err.error.message} `;
    }
    return throwError(errMsg);
  }
}

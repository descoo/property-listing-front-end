import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'api/users';
  private setUser = new BehaviorSubject<any>({});
  setUser$ = this.setUser.asObservable();

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<User>(this.url, user, { headers: headers })
      .pipe(delay(2000), catchError(this.handleError));
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.url)
      .pipe(delay(2000), catchError(this.handleError));
  }

  logout(): void {
    setTimeout(() => {
      localStorage.removeItem('currentUser');
      this.setUser.next('');
    }, 2000);
  }

  autoLogin(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser) return;
    this.setUser.next(currentUser);
  }

  changeCurrentUser(user: any) {
    if (user) {
      this.setUser.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
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

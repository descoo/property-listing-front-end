import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { User } from '../models/user.model';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'api/users';
  private currentUser = new BehaviorSubject<any>({});
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.url, user, { headers: headers })
      .pipe(delay(1000), catchError(this.handleError));
  }

  getCurrentUser(): Observable<User> {
    const currentUser: User = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    return of(currentUser).pipe(delay(1000));
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.url)
      .pipe(delay(1000), catchError(this.handleError));
  }

  getSingleUser(id: number | null): Observable<User> {
    return this.http
      .get<User>(`${this.url}/${id}`)
      .pipe(delay(1000), catchError(this.handleError));
  }

  editUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.url}/${user.id}`, user, { headers: headers })
      .pipe(
        map(() => user),
        delay(1000),
        catchError(this.handleError)
      );
  }

  unlockAccount(user: User): Observable<User> {
    user.isLocked = !user.isLocked;
    return this.http
      .put<User>(`${this.url}/${user.id}`, user, { headers: headers })
      .pipe(
        map(() => user),
        delay(1000),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.next('');
  }

  autoLogin(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser) return;
    this.currentUser.next(currentUser);
  }

  changeCurrentUser(user: User | undefined) {
    if (user) {
      this.currentUser.next(user);
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

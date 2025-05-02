import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {StorageService} from '../storage/storage.service';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {finalize, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
  }

  login(data: { email: string; password: string }): Observable<string> {
    return this.http.post<{ accessToken: string }>(
      `${environment.apiUrl}/user-auth/login`,
      data,
      {withCredentials: true}
    ).pipe(
      map(response => this.parseLogin(response)),
      catchError((error) => throwError(() => error))
    );
  }

  private parseLogin(response: any): string {
    if (!response || !response.accessToken) {
      throw new Error('Invalid login response');
    }
    return response.accessToken;
  }


  register(data: { firstName: string; email: string; password: string }): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/user-auth/register`, data).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  editFirstName(newFirstName: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/user-auth/first-name`, {NewFirstName:newFirstName}).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  editLastName(newLastName: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/user-auth/last-name`, {NewLastName:newLastName}).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  sendEmailConfirmation(): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/user-auth/confirm-email`).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  confirmEmail(data: { sub: string,token:string }): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/user-auth/confirm-email`,data).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  changePassword(data:{currentPassword:string,newPassword:string}): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/user-auth/change-password`,data).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  forgotPassword(data:{email:string}): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/user-auth/forgot-password`,data).pipe(
      catchError((error) => throwError(() => error))
    );
  }
refresh(){
  return this.http
    .put<{ accessToken: string }>(
      `${environment.apiUrl}/user-auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.storageService.accessToken}`,
        },
        withCredentials: true,
      }
    ).pipe(
      tap(response => this.storageService.setAccessToken(response.accessToken)),
      map(response => response.accessToken),
      catchError(error => {
        this.forceLogout();
        return throwError(() => error);
      })
    );
}
  resetPassword(data:{sub:string,token:string,newPassword:string}): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/user-auth/reset-password`,data).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/user-auth/logout`,
      {},
      {withCredentials: true}
    ).pipe(
      finalize(() => this.forceLogout()),
      catchError((error) => throwError(() => error))
    );
  }


  forceLogout(): void {
    this.storageService.removeAccessToken();
    this.router.navigate(['/login']).then();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {finalize, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {}

  login(data: { email: string; password: string }): Observable<string> {
    return this.http.post<{ accessToken: string }>(
      `${environment.apiUrl}/user-auth/login`,
      data,
      { withCredentials: true }
    ).pipe(
      map(response => this.parseLogin(response)),
      catchError(err => {
        console.error('Login failed:', err.message);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
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
      map(() => undefined), // Явно указываем, что ничего не возвращаем
      catchError(err => {
        console.error('Registration failed:', err.message);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }




  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/user-auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      finalize(() => this.forceLogout()),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }


  forceLogout(): void {
    this.storageService.removeAccessToken();
    this.router.navigate(['/login']).then();
  }
}

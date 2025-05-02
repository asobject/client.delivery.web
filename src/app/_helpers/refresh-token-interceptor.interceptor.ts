import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import {BehaviorSubject, finalize, Observable, throwError} from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import {AuthService} from "../_services/auth/auth.service";
import {StorageService} from "../_services/storage/storage.service";
import {environment} from "../../environments/environment";

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private authService: AuthService;
  private storageService: StorageService;

  constructor(private injector: Injector) {
    this.authService = this.injector.get(AuthService);
    this.storageService = this.injector.get(StorageService);
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(error => this.handleError(error, req, next))
    );
  }

  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.shouldHandleError(error, request)) {
      return this.handle401Error(request, next);
    }
    return throwError(() => error);
  }

  private shouldHandleError(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean {
    return error.status === 401 &&
      !this.isAuthRequest(request.url) &&
      this.storageService.accessToken !== null;
  }

  private isAuthRequest(url: string): boolean {
    const authEndpoints = [
      `${environment.apiUrl}/user-auth/login`,
      `${environment.apiUrl}/user-auth/register`,
      `${environment.apiUrl}/user-auth/refresh`
    ];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      return this.startRefreshProcess(request, next);
    }
    return this.queueRequest(request, next);
  }

  private startRefreshProcess(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refresh().pipe(
      switchMap(accessToken => this.retryRequest(request, next, accessToken)),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.isRefreshing = false)
    );
  }


  private retryRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    accessToken: string
  ): Observable<HttpEvent<unknown>> {
    this.refreshTokenSubject.next(accessToken);
    return next.handle(this.addAuthHeader(request, accessToken));
  }

  private queueRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(accessToken => next.handle(this.addAuthHeader(request, accessToken)))
    );
  }

  private addAuthHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
}

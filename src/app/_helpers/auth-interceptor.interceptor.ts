import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../_services/storage/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedEndpoints = [
    '/user-auth/login',
    '/user-auth/register',
    '/user-auth/refresh'
  ];

  constructor(
    private injector: Injector
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const reqWithCookies = req.clone({
      withCredentials: true
    });
    if (this.isExcluded(req.url)) {
      return next.handle(req);
    }
    const authReq = this.addAuthHeader(reqWithCookies);
    return next.handle(authReq);
  }

  private isExcluded(url: string): boolean {
    return this.excludedEndpoints.some(endpoint => url.includes(endpoint));
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const storageService = this.injector.get(StorageService);
    const token = storageService.accessToken;
    return token
      ? request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
      : request;
  }
}

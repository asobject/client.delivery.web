import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { JwtService } from '../auth/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService:StorageService,private jwtService:JwtService) { }

  hasRole(requiredRoles: string[]): boolean {
    const token = this.storageService.accessToken;
    if (!token) {
      return false;
    }
    const decodedToken = this.jwtService.decodeToken(token);
    if (!decodedToken || !decodedToken.roles) {
      return false;
    }
    const userRoles = Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles];
    return requiredRoles.some(role => userRoles.includes(role));
  }

  isAuthenticated(): boolean {
    return !!this.storageService.accessToken;  // Проверяем наличие accessToken
  }
}

import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {StorageService} from '../storage/storage.service';

export interface JwtPayload {
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  roles: string[];
  sub:string;
  exp: number;
}
@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private storageService: StorageService,) {}
  decodeToken(token: string): JwtPayload|null {
    try {
      return jwtDecode<JwtPayload>(token);

    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  get jwtPayload() {
    return this.decodeToken(this.storageService.accessToken!)!;
  }
}

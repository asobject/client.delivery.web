import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  email: string;
  firstName: string;
  roles: string[];
  sub:string;
  exp: number;
}
@Injectable({
  providedIn: 'root',
})
export class JwtService {
  decodeToken(token: string): JwtPayload|null {
    try {
      return jwtDecode<JwtPayload>(token);

    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

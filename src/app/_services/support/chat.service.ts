import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }
  sendMessage(data: { prompt: string }) {
    return this.http.post(
      `${environment.apiUrl}/chat`,
      data,
      { responseType: 'text' }
    ).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}

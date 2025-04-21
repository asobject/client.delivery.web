

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Проверяем наличие статуса ошибки
        if (error.status) {
          const errorMessage = error.error?.message || 'Нет сообщения от сервера';

          // Обрабатываем ошибки по статус-кодам
          const errorMessages: { [key: number]: string } = {
            400: 'Неверный запрос',
            401: 'Не авторизован',
            403: 'Доступ запрещен',
            404: 'Ресурс не найден',
            500: 'Внутренняя ошибка сервера',
          };

          const defaultMessage = 'Неизвестная ошибка';
          const errorDescription = errorMessages[error.status] || defaultMessage;

          console.error(`Ошибка ${error.status}: ${errorDescription}`, errorMessage);
        } else {
          console.error('Ошибка без статуса:', error.message);
        }

        // Пробрасываем ошибку дальше
        return throwError(() => error);
      })
    );
  }

}

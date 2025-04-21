import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {CreateOrderCommand} from "../../_models/create-order-command";
import {catchError} from "rxjs/operators";
import {PageResult} from '../../_models/page-result';
import {CalculateOrderQuery} from '../../_models/calculate-order-query';
import {OrderDTO} from '../../_models/orderDTO';
import {OrderPointChangeDTO} from '../../_models/order-point-changeDTO';
import {OrderStatusChangeDTO} from '../../_models/order-status-changeDTO';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {
  }
  createOrder(dto: CreateOrderCommand) {
    return this.http.post<void>(`${environment.apiUrl}/orders`, dto).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  getOrders(pageNumber: number = 1, pageSize: number = 10) {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{orders:PageResult<OrderDTO>}>(`${environment.apiUrl}/orders`, { params }).pipe(
      map(response => response.orders),
      catchError((error) => throwError(() => error))
    );
  }
  getOrder(tracker:string) {
    return this.http.get<{order:OrderDTO}>(`${environment.apiUrl}/orders/${tracker}`).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  getOrderChanges(tracker:string) {
    return this.http.get<{orderPointChanges: OrderPointChangeDTO[],orderStatusChanges:OrderStatusChangeDTO[]}>(`${environment.apiUrl}/orders/${tracker}/history`).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  calculatePrice(order: CalculateOrderQuery): Observable<number> {
    return this.http.post<{ price: number }>(`${environment.apiUrl}/orders/calculate`,
      order
    ).pipe(
      map(response => this.parsePrice(response.price)),
      catchError((error) => throwError(() => error))
    );
  }


  private parsePrice(response:any): number {
    // Преобразуем строку в число
    const price: number = parseFloat(response);
    if (isNaN(price)) {
      throw new Error('Invalid price value');
    }
    return price;  // Возвращаем числовое значение
  }
}


import {OrderStatus} from '../_enums/order-status.enum';

export interface OrderStatusChangeDTO {
  status: OrderStatus;
  changeAt: string;
}

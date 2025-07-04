
import {OrderStatus} from '../_enums/order-status.enum';

export interface OrderDTO {
  tracker: string;
  currentPointAddress?: string;
  receiverAddress:string;
  senderAddress:string;
  status:OrderStatus;
}


import {PaymentType} from '../_enums/payment-type.enum';
import {PackageSize} from '../_enums/package-size.enum';
import {DeliveryMethod} from '../_enums/delivery-method.enum';
import {Coordinates} from './coordinates';

export interface CreateOrderCommand {
  price: number;
  paymentType: PaymentType;
  packageSize: PackageSize;
  receiverEmail:string;
  senderDeliveryMethod: DeliveryMethod;
  receiverDeliveryMethod: DeliveryMethod;

  senderAddress?:string;
  senderCoordinates:Coordinates;
  senderCompanyPointId?:number;

  receiverCompanyPointId:number;
  receiverAddress:string;
  receiverCoordinates?:Coordinates;
}

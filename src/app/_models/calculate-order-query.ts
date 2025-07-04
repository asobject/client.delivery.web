
import {PaymentType} from '../_enums/payment-type.enum';
import {PackageSize} from '../_enums/package-size.enum';
import {DeliveryMethod} from '../_enums/delivery-method.enum';
import {Coordinates} from './coordinates';

export interface CalculateOrderQuery {
  paymentMethod: PaymentType;
  packageSize: PackageSize;
  senderDeliveryMethod: DeliveryMethod;
  receiverDeliveryMethod: DeliveryMethod;
  senderPointCoordinates:Coordinates;
  receiverPointCoordinates:Coordinates;
}

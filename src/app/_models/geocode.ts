import {Coordinates} from './coordinates';

export interface GeocodeData {
  country:string;
  province:string;
  locality:string,
  address:string,
  coordinates:Coordinates,
}

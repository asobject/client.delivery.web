import {Coordinates} from './coordinates';

export interface IPointDTO {
  id: number;
  name: string|null;
  address: string;
  coordinates: Coordinates;
  country: string|null;
  province: string|null;
  locality: string|null;
}

export class PointDTO implements IPointDTO {
  id: number;
  name: string | null;
  address: string;
  coordinates: Coordinates;
  country: string;
  province: string;
  locality: string;

  constructor(
    id: number = 0,
    name: string = '',
    address: string = '',
    coordinates: Coordinates = {latitude: 0, longitude: 0},
    country: string = '',
    province: string = '',
    locality: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.coordinates = coordinates;
    this.country = country;
    this.province = province;
    this.locality = locality;
  }
}

export class CompanyPointDTO implements IPointDTO {
  id: number;
  name: string;
  pointType: number;
  address: string;
  coordinates: Coordinates;
  pointStatus: number;
  country: string;
  province: string;
  locality: string;

  constructor(
    id: number = 0,
    name: string = '',
    pointTypeId: number = 0,
    address: string = '',
    coordinates: Coordinates = {latitude: 0, longitude: 0},
    pointStatusId: number = 0,
    country: string = '',
    province: string = '',
    locality: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.pointType = pointTypeId;
    this.address = address;
    this.coordinates = coordinates;
    this.pointStatus = pointStatusId;
    this.country = country;
    this.province = province;
    this.locality = locality;
  }
}

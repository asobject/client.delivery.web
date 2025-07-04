import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GeocodeData} from '../../_models/geocode';
import {Coordinates} from '../../_models/coordinates';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(private http: HttpClient) {
  }

  getSuggestions(query: string, types: string[], ll: Coordinates | null = null): Observable<string[]> {


    let url = `${environment.geoSuggestUrl}text=${query}`;
    if (ll) {
      url += `&ll=${ll.longitude},${ll.latitude}&spn=0.1,0.1`;
    }
    url += `&types=${types}&print_address=1&apikey=${environment.yandexGeoSuggestKey}`
    return this.http.get<{ object: any }>(url).pipe(
      map(response => this.parseSuggestions(response))
    );
  }

  getGeocode(query: string): Observable<GeocodeData> {
    const url = `${environment.geoCodeUrl}?apikey=${environment.yandexGeocodeAndMapKey}&geocode=${query}&format=json&lang=ru_RU`;
    return this.http.get<{ object: any }>(url).pipe(
      map(response => this.parseGeocode(response))
    );
  }


  private parseSuggestions(response: any): string[] {
    const suggestions: string[] = []
    if (!response.results)
      throw new Error('No results found');
    response.results.map((result: any): void => {
      suggestions.push(result.address.formatted_address);
    })
    return suggestions;
  }

  private parseGeocode(response: any): GeocodeData {
    const geoObject = response.response.GeoObjectCollection.featureMember[0].GeoObject;
    const coords = geoObject.Point.pos.split(' ').reverse();
    const components = geoObject.metaDataProperty.GeocoderMetaData.Address.Components;
    const country = components.find((comp: any) => comp.kind === 'country')?.name;
    const locality = components.find((comp: any) => comp.kind === 'locality')?.name;
    const provinces = components.filter((comp: any) => comp.kind === 'province');
    const province = provinces.length > 0 ? provinces[provinces.length - 1].name : ''; // Получаем последнее значение province
    const address = `${locality}, ${geoObject.name}`;
    return {
      country: country,
      province: province,
      locality: locality,
      address: address,
      coordinates: {
        latitude: parseFloat(coords[0]),
        longitude: parseFloat(coords[1])
      }
    };
  }
}

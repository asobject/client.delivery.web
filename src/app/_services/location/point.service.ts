import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from "rxjs/operators";
import {CompanyPointDTO} from '../../_models/pointDTO';
import {ClusterDTO} from '../../_models/clusterDTO';
import {Coordinates} from '../../_models/coordinates';


@Injectable({
  providedIn: 'root',
})


export class PointService {
  constructor(
    private http: HttpClient) {
  }
  getClusters(): Observable<ClusterDTO[]> {
    return this.http.get<{clusters:ClusterDTO[]}>(`${environment.apiUrl}/points/clusters`).pipe(
      map(response=>response.clusters),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  getPoint(id: number): Observable<CompanyPointDTO> {
    const params = new HttpParams()
      .set('id', id)
    return this.http.get<{ data:CompanyPointDTO }>(`${environment.apiUrl}/points`,{params}).pipe(
      map(response=>response.data),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  checkExistPoint(coordinates:Coordinates) {
    const params = new HttpParams()
      .set('lat', coordinates.latitude).set('lon', coordinates.longitude);
    return this.http.get<{exist:boolean}>(`${environment.apiUrl}/points`,{params}).pipe(
      map(response=>response),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}

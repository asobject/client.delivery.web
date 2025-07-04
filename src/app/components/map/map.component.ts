import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PointService} from '../../_services/location/point.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ScrollerModule} from 'primeng/scroller';
import {Card} from 'primeng/card';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {ClusterDTO} from '../../_models/clusterDTO';
import {Dialog} from 'primeng/dialog';
import {Coordinates} from '../../_models/coordinates';
import {getPointTypeLabel} from '../../_enums/point-type.enum';
import {NgIf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-map',
  imports: [
    Card,
    ScrollerModule,
    FormsModule,
    Dialog,
    ReactiveFormsModule,
    NgIf,
    Skeleton,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  clusters: ClusterDTO[] = [];
  selectedPoint!: CompanyPointDTO;
  private map: any;
  private ymaps = (window as any).ymaps;
  private center: Coordinates = {latitude: 55.0415, longitude: 82.9346};
  loadingMap: boolean = true;
  pointDialog: boolean = false;
  loadingPoint:boolean = true;

  constructor(private pointService: PointService, private fb: FormBuilder, private ngZone: NgZone) {

  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.pointService.getClusters()
      .pipe(
        finalize(() => this.initMap()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (clusters) => {
          this.clusters = clusters;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  private initMap(): void {
    this.ymaps.ready(() => {
      this.map = new this.ymaps.Map('map', {
        center: [this.center.latitude, this.center.longitude],
        zoom: 11.5,
        controls: ['zoomControl', 'typeSelector', 'geolocationControl'],
      });
      this.addMarkers();
    });
    this.loadingMap=false;
  }


  private addMarkers(): void {
    this.clusters.forEach((cluster: ClusterDTO) => {
      const coords = [cluster.coordinates.latitude, cluster.coordinates.longitude];
      const placemark = new this.ymaps.Placemark(coords, {
        id: cluster.id
      });
      placemark.events.add('click', () => {

        this.ngZone.run(() => {
          this.pointDialog = true;
          this.pointService.getPoint(placemark.properties.get('id')).pipe(takeUntil(this.destroy$),finalize(() => this.loadingPoint = false))
            .subscribe({
              next: (data) => {
                this.selectedPoint = data;
              },
              error: () => {
              }
            });
        });
      });
      this.map.geoObjects.add(placemark);
    });
  }

  hideDialog() {
    this.pointDialog = false;
  }



  // private setCenter(lat: number, lng: number) {
  //   this.map.setCenter([lat, lng], 15, {
  //     duration: 500,
  //     checkZoomRange: false
  //   });
  //   // this.map.panTo([lat, lng], {
  //   //   flying: true, // Включает анимацию
  //   //   duration: 500,
  //   // });
  // }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getPointTypeLabel = getPointTypeLabel;
}

import {AfterViewInit, Component, input, NgZone, OnDestroy, OnInit, output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {PointService} from '../../_services/location/point.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {ClusterDTO} from '../../_models/clusterDTO';
import {Coordinates} from '../../_models/coordinates';
import {getPointTypeLabel} from '../../_enums/point-type.enum';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {NgIf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-map-choice',
  imports: [
    ConfirmDialog,
    NgIf,
    Skeleton,
    Button
  ],
  templateUrl: './map-choice.component.html',
  styleUrl: './map-choice.component.scss'
})
export class MapChoiceComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  dataInput = input<Coordinates>();
  dataOutput = output<CompanyPointDTO>();
  clusters: ClusterDTO[] = [];
  selectedPoint!: CompanyPointDTO;
  isChild: boolean = false;
  private map: any;
  private ymaps = (window as any).ymaps;
  private center: Coordinates = {latitude: 55.0415, longitude: 82.9346};
  loadingMap: boolean = true;
  loadingPoint: boolean = false;

  constructor(private pointService: PointService, private fb: FormBuilder, private ngZone: NgZone,private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    if (this.dataInput()) {
      this.isChild = true;
      this.center = this.dataInput()!;
    }
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

      // Создаем метку с данными кластера в свойствах
      const placemark = new this.ymaps.Placemark(coords, {
        clusterId: cluster.id // сохраняем ID в свойствах метки
      }, {
        preset: 'islands#icon', // стиль метки
        iconColor: '#0095b6'
      });

      // Обработчик клика
      placemark.events.add('click', (e: any) => {
        this.ngZone.run(() => {
          // Получаем данные из метки
          const target = e.get('target');
          const clusterId = target.properties.get('clusterId');

          // Передаем данные в сервис
          this.handleMarkerClick(clusterId);
        });
      });

      this.map.geoObjects.add(placemark);
    });
  }

  private handleMarkerClick(clusterId: number): void {
    this.loadingPoint=true;
    this.confirmationService.confirm({
      header: 'Подтверждение',
      rejectVisible: false,
      acceptVisible: false
    });
    this.pointService.getPoint(clusterId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingPoint=false)
    ).subscribe({
      next: (data) => {
       this.selectedPoint=data;
      },
      error: (err) => console.error(err)
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getPointTypeLabel = getPointTypeLabel;

  onAccept() {
    this.dataOutput.emit(this.selectedPoint);
  }
}

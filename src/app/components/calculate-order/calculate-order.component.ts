import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {GeoService} from '../../_services/yMap/geo.service';
import {Card} from 'primeng/card';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {Button, ButtonDirective} from 'primeng/button';
import {RadioButton} from 'primeng/radiobutton';
import {EMPTY, finalize, forkJoin, Subject, takeUntil} from 'rxjs';
import {NgIf} from '@angular/common';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import {FloatLabel} from 'primeng/floatlabel';
import {Coordinates} from '../../_models/coordinates';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {OrderService} from '../../_services/order/order.service';
import {CreateOrderCommand} from '../../_models/create-order-command';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UserService} from '../../_services/user/user.service';
import {DeliveryMethod, getDeliveryMethodLabel} from '../../_enums/delivery-method.enum';
import {getPaymentTypeLabel, PaymentType} from '../../_enums/payment-type.enum';
import {CalculateOrderQuery} from '../../_models/calculate-order-query';
import {getPackageSizeLabel} from '../../_enums/package-size.enum';
import {MapChoiceComponent} from '../map-choice/map-choice.component';
import {Skeleton} from 'primeng/skeleton';
import {PointService} from '../../_services/location/point.service';
import {catchError, switchMap} from 'rxjs/operators';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-calculate-order',
  imports: [
    Card,
    ReactiveFormsModule,
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    Button,
    RadioButton,
    FormsModule,
    NgIf,
    AutoComplete,
    FloatLabel,
    Dialog,
    InputText,
    ButtonDirective,
    MapChoiceComponent,
    Skeleton,
    Tag
  ],
  templateUrl: './calculate-order.component.html',
  styleUrls: ['./calculate-order.component.scss']
})
export class CalculateOrderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private queryParams: any;

  isInitialize: boolean = false;
  isCalculatingOrder: boolean = false;
  isCreatingOrder: boolean = false;

  startPointCheckExist: boolean = false;
  endPointCheckExist: boolean = false;

  deliveryForm!: FormGroup;
  calculationForm!: FormGroup;
  bufForm!: FormGroup;
  suggestions: string[] = [];
  pointDialog: boolean = false;
  isSender: boolean = true;

  startCoordinates!: Coordinates;
  endCoordinates!: Coordinates;
  sendCoordinatesToMap!: Coordinates;

  DeliveryMethod = DeliveryMethod;
  PaymentType = PaymentType;

  createOrderCommand!: CreateOrderCommand;
  calculateOrderQuery!: CalculateOrderQuery;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private geoService: GeoService,
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private pointService: PointService
  ) {
    // Проверка и сохранение query параметров
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const packageSize = Number(data['packageSize']);
      if (!data['startPoint'] || !data['endPoint'] || isNaN(packageSize)) {
        this.router.navigate(['/']).then();
        return;
      }
      this.queryParams = {...data, packageSize};
    });

    this.initializeForms();
    this.initializeFormListeners();
  }

  ngOnInit(): void {
    this.isInitialize = true;

    const geocodeRequests$ = forkJoin({
      startPoint: this.geoService.getGeocode(this.queryParams?.startPoint),
      endPoint: this.geoService.getGeocode(this.queryParams?.endPoint)
    }).pipe(
      takeUntil(this.destroy$)
    );

    geocodeRequests$.pipe(
      switchMap(({startPoint, endPoint}) => {
        this.startCoordinates = startPoint.coordinates;
        this.endCoordinates = endPoint.coordinates;

        return forkJoin({
          startCheck: this.pointService.checkExistPoint(this.startCoordinates),
          endCheck: this.pointService.checkExistPoint(this.endCoordinates)
        }).pipe(
          catchError(error => {
            console.error('Point check error:', error);
            this.router.navigate(['/']).then();
            return EMPTY;
          })
        );
      }),
      finalize(() => {
        this.isInitialize = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({startCheck, endCheck}) => {
        this.startPointCheckExist = startCheck.exist;
        this.endPointCheckExist = endCheck.exist;
      },
      error: (err) => {
        console.error('Geocode loading error:', err);
        this.router.navigate(['/']).then();
      }
    });
  }

  private initializeForms(): void {
    this.deliveryForm = this.fb.group({
      sendMethod: [DeliveryMethod.PickupPoint, Validators.required],
      receiveMethod: [DeliveryMethod.PickupPoint, Validators.required],
      paymentMethod: [null, Validators.required],
      startPoint: [null, Validators.required],
      endPoint: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    });

    this.calculationForm = this.fb.group({
      sendLocation: [{value: this.queryParams?.startPoint, disabled: true}, Validators.required],
      receiveLocation: [{value: this.queryParams?.endPoint, disabled: true}, Validators.required],
      packageSize: [{
        value: getPackageSizeLabel(this.queryParams?.packageSize),
        disabled: true
      }, Validators.required],
      totalCost: [{value: null, disabled: true}, Validators.required]
    });

    this.bufForm = this.fb.group({
      startPoint: [null, Validators.required],
      endPoint: [null, Validators.required],
      paymentMethod: [null, Validators.required],
      email: [null, Validators.required]
    });
  }

  private initializeFormListeners(): void {
    // Обновляем буферные формы при изменении платежного метода и email
    this.deliveryForm.get('paymentMethod')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.bufForm.get('paymentMethod')?.setValue(value));
    this.deliveryForm.get('email')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (this.deliveryForm.get('email')?.valid) {
          this.bufForm.get('email')?.setValue(value);
        }
      });

    // При валидности буферной формы автоматически рассчитываем стоимость заказа
    this.bufForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status === 'VALID') {
          this.calculateOrder();
        }
      });
  }

  resetPoint(field: string): void {
    this.deliveryForm.get(field)?.reset();
    this.bufForm.get(field)?.reset();
  }

  getMethodLabel(method: DeliveryMethod): string {
    return getDeliveryMethodLabel(method);
  }

  getPaymentLabel(type: PaymentType): string {
    return getPaymentTypeLabel(type);
  }

  calculateOrder(): void {
    this.isCalculatingOrder = true;
    this.calculateOrderQuery = {
      senderDeliveryMethod: this.deliveryForm.get('sendMethod')?.value,
      receiverDeliveryMethod: this.deliveryForm.get('receiveMethod')?.value,
      paymentMethod: this.paymentMethod,
      packageSize: this.queryParams['packageSize'],
      senderPointCoordinates: this.bufForm.get('startPoint')?.value['coordinates'],
      receiverPointCoordinates: this.bufForm.get('endPoint')?.value['coordinates']
    };
    this.calculationForm.get('totalCost')?.setValue("Идет расчет...");
    this.orderService.calculatePrice(this.calculateOrderQuery)
      .pipe(takeUntil(this.destroy$), finalize(() => {
        this.isCalculatingOrder = false
      }))
      .subscribe({
        next: (data) => {
          this.calculationForm.get('totalCost')?.setValue(data);
        },
        error: () => {
          this.calculationForm.get('totalCost')?.setValue(null);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось рассчитать стоимость',
            life: 5000
          });
        }
      });
  }

  // Обработка выбора адреса из автодополнения
  onSelect(event: AutoCompleteSelectEvent, isSender: boolean): void {
    this.geoService.getGeocode(event.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const field = isSender ? 'startPoint' : 'endPoint';
          this.bufForm.get(field)?.setValue(data);
        },
        error: (err) => {
          this.suggestions = [];
          console.error('Ошибка загрузки гео-данных:', err);
        }
      });
  }

  // Загрузка подсказок с сервера
  loadSuggestions(event: AutoCompleteCompleteEvent, isSender: boolean): void {
    const query = event.query.trim();
    if (query.length < 2) {
      this.suggestions = [];
      return;
    }
    const coords = isSender ? this.startCoordinates : this.endCoordinates;
    this.geoService.getSuggestions(query, ['house'], coords)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.suggestions = data,
        error: (err) => {
          this.suggestions = [];
          console.error('Ошибка загрузки подсказок:', err);
        }
      });
  }

  // Обработка выбора точки на карте
  handePointChange(event: CompanyPointDTO): void {
    this.hideDialog();
    const field = this.isSender ? 'startPoint' : 'endPoint';
    this.bufForm.get(field)?.setValue(event);
  }

  showMap(isSender: boolean): void {
    this.isSender = isSender;
    this.sendCoordinatesToMap = isSender ? this.startCoordinates : this.endCoordinates;
    this.pointDialog = true;
  }

  hideDialog(): void {
    this.pointDialog = false;
  }

  // Отправка заказа
  submit(): void {
    if (
      this.deliveryForm.invalid && this.bufForm.invalid
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Для оформления нужно заполнить форму',
        life: 5000
      });
      return;
    }
    if (!this.userService.isAuthenticated()) {
      this.confirmationService.confirm({
        message: 'Для оформления нужно быть авторизованным.',
        header: 'Оформление',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ок',
        rejectLabel: 'Отменить',
        accept: () => this.router.navigate(['/login']).then()
      });
      return;
    }
    this.isCreatingOrder = true;
    this.createOrderCommand = {
      price: this.calculationForm.get('totalCost')?.value,
      paymentType: this.paymentMethod,
      packageSize: this.queryParams?.packageSize,
      receiverEmail: this.deliveryForm.get('email')?.value,
      senderDeliveryMethod: this.sendMethod,
      receiverDeliveryMethod: this.receiveMethod,
      senderAddress: this.bufForm.get('startPoint')?.value['address'],
      receiverAddress: this.bufForm.get('endPoint')?.value['address'],
      senderCoordinates: this.bufForm.get('startPoint')?.value['coordinates'],
      receiverCoordinates: this.bufForm.get('endPoint')?.value['coordinates'],
      senderCompanyPointId: this.bufForm.get('startPoint')?.value['id'],
      receiverCompanyPointId: this.bufForm.get('endPoint')?.value['id']
    };

    this.orderService.createOrder(this.createOrderCommand)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isCreatingOrder = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/']).then();
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Отправление создано',
            life: 3000
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось создать заказ',
            life: 5000
          });
        }
      });
  }

  // Геттеры для полей из форм
  get sendMethod() {
    return this.deliveryForm.get('sendMethod')?.value;
  }

  get receiveMethod() {
    return this.deliveryForm.get('receiveMethod')?.value;
  }

  get paymentMethod() {
    return this.deliveryForm.get('paymentMethod')?.value;
  }

  get packageSize() {
    return this.calculationForm.get('packageSize')?.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUnselect(isSender: boolean) {
    if (isSender) {
      this.bufForm.get('startPoint')?.reset();
    } else {
      this.bufForm.get('endPoint')?.reset();
    }
  }
}

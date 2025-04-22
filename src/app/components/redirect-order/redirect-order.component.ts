import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {GeoService} from '../../_services/yMap/geo.service';
import {Router} from '@angular/router';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Card} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {Button, ButtonDirective} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {Select} from 'primeng/select';
import { getPackageSizeOptions} from '../../_enums/package-size.enum';

@Component({
  selector: 'app-redirect-order',
  imports: [
    Card,
    ReactiveFormsModule,
    AutoComplete,
    DropdownModule,
    ButtonDirective,
    Button,
    FloatLabel,
    Select
  ],
  templateUrl: './redirect-order.component.html',
  styleUrl: './redirect-order.component.scss'
})
export class RedirectOrderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  deliveryForm: FormGroup;

  suggestions: string[] = [];
  packageSizeOptions = getPackageSizeOptions();

  constructor(private fb: FormBuilder, private geoService: GeoService, private router: Router) {
    this.deliveryForm = this.fb.group({
      startPoint: [null, Validators.required],
      endPoint: [null, Validators.required],
      packageSize: [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  loadSuggestions(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim();

    if (query.length < 2) {
      this.suggestions = []; // Очищаем результаты при коротком запросе
      return;
    }

    this.geoService.getSuggestions(query, ['locality'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.suggestions = data,
        error: (err) => {
          this.suggestions = [];
          console.error('Ошибка загрузки подсказок:', err)
        }
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {

    if (this.startPoint?.value && this.endPoint?.value && this.packageSize?.value) {
      this.router.navigate(['/calculate'], {
        queryParams: {
          startPoint: this.startPoint?.value,
          endPoint: this.endPoint?.value,
          packageSize: this.packageSize?.value
        }
      }).then();
    } else {
      console.log('Missing required parameters');
    }
  }
  selectCity(city: string, controlName: string): void {
    this.deliveryForm.get(controlName)?.setValue(city);
  }

  get startPoint() {
    return this.deliveryForm.get('startPoint');
  }

  get endPoint() {
    return this.deliveryForm.get('endPoint');
  }
  get packageSize() {
    return this.deliveryForm.get('packageSize');
  }
}

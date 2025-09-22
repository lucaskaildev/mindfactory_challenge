import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService, AutomotorResponseDto, CreateAutomotorDto, UpdateAutomotorDto } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-automotor-form-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './automotor-form.page.html'
})
export class AutomotorFormPage implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;
  errors: string[] = [];
  isEdit = false;
  currentDominio: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      dominio: ['', [Validators.required, Validators.pattern(/^(?:[A-Z]{3}[0-9]{3}|[A-Z]{2}[0-9]{3}[A-Z]{2})$/)]],
      numeroChasis: [''],
      numeroMotor: [''],
      color: [''],
      fechaFabricacion: ['', [Validators.required, Validators.pattern(/^\d{6}$/), this.yyyyMmNotFutureValidator]],
      cuitDuenio: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    });

    const dominioParam = this.route.snapshot.paramMap.get('dominio');
    this.isEdit = !!dominioParam;
    if (this.isEdit && dominioParam) {
      this.currentDominio = dominioParam.toUpperCase();
      this.loadAutomotor(this.currentDominio);
      this.form.get('dominio')?.disable();
    }
  }

  private loadAutomotor(dominio: string): void {
    this.loading = true;
    this.error = null;
    this.errors = [];
    this.api.getAutomotorByDominio(dominio).subscribe({
      next: (row: AutomotorResponseDto) => {
        this.form.patchValue({
          dominio: row.dominio?.toUpperCase() || '',
          numeroChasis: row.numeroChasis || '',
          numeroMotor: row.numeroMotor || '',
          color: row.color || '',
          fechaFabricacion: String(row.fechaFabricacion || ''),
          cuitDuenio: row.dueno?.cuit || '',
        });
        this.loading = false;
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Error cargando automotor';
        this.error = Array.isArray(message) ? message.join(', ') : String(message);
        const serverErrors = err?.error?.errors;
        this.errors = Array.isArray(serverErrors) ? serverErrors.map((e: { message: string }) => e.message) : [];
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = null;
    this.errors = [];

    const raw = this.form.getRawValue();
    const dominio = (this.isEdit ? this.currentDominio! : (raw.dominio || '')).toUpperCase();

    const payload: CreateAutomotorDto | UpdateAutomotorDto = {
      dominio,
      numeroChasis: raw.numeroChasis || undefined,
      numeroMotor: raw.numeroMotor || undefined,
      color: raw.color || undefined,
      fechaFabricacion: Number(raw.fechaFabricacion),
      cuitDuenio: raw.cuitDuenio,
    };

    // Preflight: ensure Sujeto exists, otherwise allow creating quickly
    this.api.getSujetoByCuit(payload.cuitDuenio ?? '').subscribe({
      next: () => this.saveAutomotor(dominio, payload),
      error: (err) => {
        const serverErrors = err?.error?.errors;
        this.errors = Array.isArray(serverErrors) ? serverErrors.map((e: unknown) => String(e)) : [];
        this.promptCreateSujetoThenSave(dominio, payload);
      },
    });
  }

  private saveAutomotor(dominio: string, payload: CreateAutomotorDto | UpdateAutomotorDto): void {
    const request$ = this.isEdit
      ? this.api.updateAutomotor(dominio, payload)
      : this.api.createAutomotor(payload as CreateAutomotorDto);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/automotores']);
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Error guardando automotor';
        this.error = Array.isArray(message) ? message.join(', ') : String(message);
        const serverErrors = err?.error?.errors;
        this.errors = Array.isArray(serverErrors) ? serverErrors.map((e: unknown) => String(e)) : [];
        this.saving = false;
      },
    });
  }

  onDominioInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = (input.value || '').toUpperCase();
    if (upper !== input.value) {
      input.value = upper;
    }
    this.form.get('dominio')?.setValue(upper, { emitEvent: false });
  }

  private promptCreateSujetoThenSave(dominio: string, payload: CreateAutomotorDto | UpdateAutomotorDto): void {
    const wantsCreate = window.confirm('No existe Sujeto con ese CUIT. Se usará el CUIT del formulario. ¿Desea crear el Sujeto?');
    if (!wantsCreate) {
      this.saving = false;
      this.error = 'Debe crear el Sujeto para continuar.';
      return;
    }
    const denominacion = window.prompt('Denominacion');
    if (!denominacion) {
      this.saving = false;
      this.error = 'Denominacion requerida para crear Sujeto.';
      return;
    }
    this.api.createSujeto({ cuit: payload.cuitDuenio ?? '', denominacion }).subscribe({
      next: () => this.saveAutomotor(dominio, payload),
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Error creando sujeto';
        this.error = Array.isArray(message) ? message.join(', ') : String(message);
        const serverErrors = err?.error?.errors;
        this.errors = Array.isArray(serverErrors) ? serverErrors.map((e: { message: string }) => e.message) : [];
        this.saving = false;
      },
    });
  }

  private yyyyMmNotFutureValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value || !/^\d{6}$/.test(value)) return null; // pattern handles basic format
    const year = Number(value.substring(0, 4));
    const month = Number(value.substring(4, 6));
    if (month < 1 || month > 12) return { yyyyMm: 'Mes inválido' };
    const now = new Date();
    const currentYyyyMm = Number(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`);
    if (Number(value) > currentYyyyMm) return { yyyyMm: 'Fecha futura' };
    return null;
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

export interface AutomotorListItem {
  dominio: string;
  cuitDueno: string | null;
  denominacionDueno: string | null;
  fechaFabricacion: number; // YYYYMM
}

@Component({
  standalone: true,
  selector: 'app-automotores-list-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './automotores-list.page.html'
})
export class AutomotoresListPage implements OnInit {
  automotores: AutomotorListItem[] = [];
  loading = true;
  error: string | null = null;
  errors: string[] = [];
  dominiosBeingDeleted: Set<string> = new Set<string>();

  constructor(private readonly api: ApiService) { }

  ngOnInit(): void {
    this.fetchAutomotores();
  }

  private fetchAutomotores(): void {
    this.loading = true;
    this.error = null;
    this.errors = [];
    this.api.getAutomotores().subscribe({
      next: (rows) => {
        this.automotores = rows.map((row) => ({
          dominio: (row.dominio || '').toUpperCase(),
          cuitDueno: row.dueno?.cuit ?? null,
          denominacionDueno: row.dueno?.denominacion ?? null,
          fechaFabricacion: row.fechaFabricacion,
        }));
        this.loading = false;
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Error cargando automotores';
        this.error = Array.isArray(message) ? message.join(', ') : String(message);
        const serverErrors = err?.error?.errors;
        this.errors = Array.isArray(serverErrors) ? serverErrors.map((e: { message: string }) => e.message) : [];
        this.loading = false;
      },
    });
  }

  onDelete(dominio: string): void {
    const confirmed = window.confirm(`Eliminar automotor ${dominio}?`);
    if (!confirmed) return;
    const normalized = (dominio || '').toUpperCase();
    if (this.dominiosBeingDeleted.has(normalized)) return;
    this.dominiosBeingDeleted.add(normalized);
    this.error = null;
    this.errors = [];
    this.api.deleteAutomotor(normalized).subscribe({
      next: () => {
        this.fetchAutomotores();
        this.dominiosBeingDeleted.delete(normalized);
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Error eliminando automotor';
        this.error = Array.isArray(message) ? message.join(', ') : String(message);
        const serverErrors = err?.error?.errors;
        this.errors = Array.isArray(serverErrors) ? serverErrors.map((e: unknown) => String(e)) : [];
        this.dominiosBeingDeleted.delete(normalized);
      },
    });
  }

  trackByDominio(index: number, item: AutomotorListItem): string {
    return item.dominio;
  }
}

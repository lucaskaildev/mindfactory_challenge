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

  constructor(private readonly api: ApiService) { }

  ngOnInit(): void {
    this.fetchAutomotores();
  }

  private fetchAutomotores(): void {
    this.loading = true;
    this.error = null;
    this.api.getAutomotores().subscribe({
      next: (rows) => {
        this.automotores = rows.map((row) => ({
          dominio: row.dominio,
          cuitDueno: row.dueno?.cuit ?? null,
          denominacionDueno: row.dueno?.denominacion ?? null,
          fechaFabricacion: row.fechaFabricacion,
        }));
        this.loading = false;
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Error cargando automotores';
        this.error = Array.isArray(message) ? message.join(', ') : String(message);
        this.loading = false;
      },
    });
  }

  onDelete(dominio: string): void {
    const confirmed = window.confirm(`Eliminar automotor ${dominio}?`);
    if (!confirmed) return;
    this.automotores = this.automotores.filter((a) => a.dominio !== dominio);
  }

  trackByDominio(index: number, item: AutomotorListItem): string {
    return item.dominio;
  }
}

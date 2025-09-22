import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AutomotorResponseDto {
  dominio: string;
  numeroChasis?: string;
  numeroMotor?: string;
  color?: string;
  fechaFabricacion: number;
  dueno?: SujetoDto;
}

export interface CreateAutomotorDto {
  dominio: string;
  numeroChasis?: string;
  numeroMotor?: string;
  color?: string;
  fechaFabricacion: number;
  cuitDuenio: string;
}

export type UpdateAutomotorDto = Partial<CreateAutomotorDto>;

export interface SujetoDto {
  cuit: string;
  denominacion: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAutomotores(): Observable<AutomotorResponseDto[]> {
    return this.http.get<AutomotorResponseDto[]>(`${this.base}/automotores`);
  }

  getAutomotorByDominio(dominio: string): Observable<AutomotorResponseDto> {
    return this.http.get<AutomotorResponseDto>(`${this.base}/automotores/${dominio}`);
  }

  createAutomotor(dto: CreateAutomotorDto): Observable<AutomotorResponseDto> {
    return this.http.post<AutomotorResponseDto>(`${this.base}/automotores`, dto);
  }

  updateAutomotor(dominio: string, dto: UpdateAutomotorDto): Observable<AutomotorResponseDto> {
    return this.http.put<AutomotorResponseDto>(`${this.base}/automotores/${dominio}`, dto);
  }

  deleteAutomotor(dominio: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/automotores/${dominio}`);
  }

  getSujetoByCuit(cuit: string): Observable<SujetoDto> {
    return this.http.get<SujetoDto>(`${this.base}/sujetos/by-cuit`, { params: { cuit } });
  }

  createSujeto(dto: SujetoDto): Observable<SujetoDto> {
    return this.http.post<SujetoDto>(`${this.base}/sujetos`, dto);
  }
}

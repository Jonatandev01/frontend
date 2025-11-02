import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { ApiResponse } from '../../shared/interfaces/api-response.interface';
import type { Alojamiento } from '../../shared/interfaces/alojamiento.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlojamientoService {
  constructor(private http: HttpClient) {}

  getAllAlojamientos(): Observable<ApiResponse<Alojamiento[]>> {
    return this.http.get<ApiResponse<Alojamiento[]>>(`${environment.apiUrl}/alojamientos`);
  }
  getMisAlojamientos(): Observable<ApiResponse<Alojamiento[]>> {
    return this.http.get<ApiResponse<Alojamiento[]>>(`${environment.apiUrl}/mis-alojamientos`);
  }
  addToMisAlojamientos(alojamiento_id: number) {
    return this.http.post<ApiResponse<Alojamiento>>(`${environment.apiUrl}/mis-alojamientos`, { alojamiento_id });
  }
  removeFromMisAlojamientos(alojamiento_id: number) {
    return this.http.delete<ApiResponse<any>>(`${environment.apiUrl}/mis-alojamientos/${alojamiento_id}`);
  }
  createAlojamiento(data: Partial<Alojamiento>) {
    return this.http.post<ApiResponse<Alojamiento>>(`${environment.apiUrl}/admin/alojamientos`, data);
  }
}
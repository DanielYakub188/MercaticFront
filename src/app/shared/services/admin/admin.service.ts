import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserMeResponse } from '../../models/UserMeResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener usuarios con filtros
  getUsers(page: number, size: number, search: string, sortBy: string, sortDirection: string): Observable<UserMeResponse[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<UserMeResponse[]>(`${this.baseUrl}/users`, { params });
  }

  // 🔹 Actualizar usuario
  updateUser(user: UserMeResponse): Observable<UserMeResponse> {
    return this.http.put<UserMeResponse>(`${this.baseUrl}/users/${user.id}`, user);
  }
}

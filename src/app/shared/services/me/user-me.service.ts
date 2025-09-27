import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserMeResponse } from '../../models/UserMeResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserMeService {

    private apiUrl = 'http://localhost:8080/user/me';

  constructor(private http: HttpClient) { }

  getUserMe(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>(this.apiUrl, { withCredentials: true });
  }
}

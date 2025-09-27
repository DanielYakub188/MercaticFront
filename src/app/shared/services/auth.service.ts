import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from '../models/Register';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{
      id: string; email: string; role: string; token?: string; nombre: string;
    }>(
      `http://localhost:8080/api/auth/login`,
      { email, password },
      { withCredentials: true } // ✅ importante para enviar/guardar cookie
    );
  }

  register(registerRequest: Register): Observable<string> {
    return this.http.post<string>(
      `http://localhost:8080/api/auth/register`,
      registerRequest,
      { withCredentials: true } // ✅ también en el registro
    );
  }

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.loggedIn.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('id');
  }

  setSession(user: { id: string; email: string; role: string; token?: string; }) {
    localStorage.setItem('id', user.id);
    localStorage.setItem('email', user.email);
    localStorage.setItem('role', user.role);
    if (user.token) localStorage.setItem('token', user.token);

    this.loggedIn.next(true); // 👈 Notificamos login
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false); // 👈 Notificamos logout
  }
}

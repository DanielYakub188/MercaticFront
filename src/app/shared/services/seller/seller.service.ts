import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

private api = 'http://localhost:8080/vendedor/crearProducto';


constructor(private http: HttpClient) {}


crearProducto(data: FormData): Observable<any> {
return this.http.post(this.api, data);
}
}

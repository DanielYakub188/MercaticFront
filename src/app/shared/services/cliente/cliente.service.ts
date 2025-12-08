import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../../models/Productos';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

constructor(private http: HttpClient) { }

  recogerProductosBusqueda(productoNombre:string):Observable<Producto[]>
  { const headers = new HttpHeaders({
      nombre: productoNombre
    });
    return this.http.get<Producto[]>(`http://localhost:8080/cliente/busqueda`,{headers})
  }

}

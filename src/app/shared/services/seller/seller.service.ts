import { environment } from './../../environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../../models/Productos';

@Injectable({
  providedIn: 'root'
})
export class SellerService {



constructor(private http: HttpClient) {}


crearProducto(formData: FormData) {
  return this.http.post(
    'http://localhost:8080/vendedor/crearProducto',
    formData,
    { withCredentials: true }
  );
}
listarProductos(): Observable<Producto[]> {
  return this.http.get<Producto[]>(
    'http://localhost:8080/vendedor/listar',
    { withCredentials: true }
  );
}
modificarProducto(id: number, formData: FormData) {
  return this.http.put(
    `http://localhost:8080/vendedor/modificar/${id}`,
    formData,
    { withCredentials: true }
  );
}

borrarProducto(id: number) {
  return this.http.delete(
    `http://localhost:8080/vendedor/borrar/${id}`,
    { withCredentials: true }
  );
}
}

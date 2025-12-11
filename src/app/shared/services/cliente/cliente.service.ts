import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../../models/Productos';
import { Carrito } from '../../models/Carrito';

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
  añadirProductoCarrito(idProducto: number, unidades: number = 1): Observable<any> {
  return this.http.post(
    `http://localhost:8080/carrito/add/${idProducto}?unidades=${unidades}`,
    {},
    { withCredentials: true }
  );
}

listarCarrito(): Observable<any> {
  return this.http.get<any>(
    `http://localhost:8080/carrito/listar`,
    { withCredentials: true }
  );
}
eliminarDelCarrito(idProducto: number) {
  return this.http.delete(
    `http://localhost:8080/carrito/eliminar/${idProducto}`,
    {withCredentials:true}
  );
  }
  comprarCarrito(): Observable<any> {
  return this.http.post(
    `http://localhost:8080/carrito/comprar`,
    {},
    { withCredentials: true }
  );
}
obtenerBalance(): Observable<number> {
  return this.http.get<number>(
    'http://localhost:8080/cliente/balance',
    { withCredentials: true }
  );
}
}

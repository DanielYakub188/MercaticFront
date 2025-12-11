import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../../models/Pedidos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private baseUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) { }

  // Crear un nuevo pedido desde el carrito
  crearPedido(): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/crear`, {}, { withCredentials: true });
  }

  // Completar un pedido (descontar balance, pasar a FINALIZADO)
  completarPedido(idPedido: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/completar/${idPedido}`, {}, { withCredentials: true });
  }

  // Cancelar un pedido en curso
  cancelarPedido(idPedido: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/cancelar/${idPedido}`, {}, { withCredentials: true });
  }

  // Listar pedidos en curso del usuario
  listarPedidosEnCurso(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/en-curso`, { withCredentials: true });
  }

  // Listar pedidos finalizados del usuario
  listarPedidosFinalizados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/finalizados`, { withCredentials: true });
  }

  // Listar pedidos que contienen productos del vendedor logueado
  listarPedidosVendedor(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/mis-productos`, { withCredentials: true });
  }

  //Eliminar pedido
  eliminarPedido(idPedido: number): Observable<boolean> {
  return this.http.delete<boolean>(`${this.baseUrl}/eliminar/${idPedido}`, { withCredentials: true });
}
}

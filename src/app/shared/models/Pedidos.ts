import { Producto, Usuario } from './Productos';

export interface Pedido {
  id: number;
  usuario: Usuario
  estado: 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  total: number;
  productos: Producto[];
}

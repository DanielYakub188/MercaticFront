import { Producto } from "./Productos";
import { Usuario } from "./Productos";
export interface Carrito {
  id: number;
  producto: Producto;
  unidades: number;
  comprado: boolean;
}

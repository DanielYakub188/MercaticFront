export interface DatosUsuario {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  localidad: string;
  direccion: string;
}

export interface Usuario {
  id: number;
  correoElectronico: string;
  rol: string;
  datosUsuario: DatosUsuario;
}

export interface Producto {
  id: number;
  nombreProducto: string;
  precio: number;
  formatoProducto: string;
  stock:number;
  imagenUrl: string;
  categoria: string;
  usuario: Usuario;
}

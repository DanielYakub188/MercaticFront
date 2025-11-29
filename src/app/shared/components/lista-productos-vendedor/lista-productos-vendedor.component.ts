import { Component, Input } from '@angular/core';
import { Producto } from '../../models/Productos';
import { CommonModule } from '@angular/common';
import { SellerService } from '../../services/seller/seller.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-lista-productos-vendedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-productos-vendedor.component.html',
  styleUrl: './lista-productos-vendedor.component.scss',
})
export class ListaProductosVendedorComponent {
  @Input() productos: Producto[] = [];

  productoEdit: any = null;
  imagenNueva: File | null = null;
  imagenPreview: string | null = null;
  busqueda: string = '';
  productosFiltrados: Producto[] = [];
  productosPaginados: Producto[] = [];
  paginaActual: number = 0;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;
  modal: any;

  constructor(private sellerService: SellerService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.sellerService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrarProductos();
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      },
    });
  }
  filtrarProductos() {
    const text = this.busqueda.toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.nombreProducto.toLowerCase().includes(text) ||
        p.categoria.toLowerCase().includes(text) ||
        p.formatoProducto.toLowerCase().includes(text)
    );

    this.paginaActual = 0;
    this.actualizarPaginacion();
  }
  actualizarPaginacion() {
  this.totalPaginas = Math.ceil(
    this.productosFiltrados.length / this.itemsPorPagina
  );

  const inicio = this.paginaActual * this.itemsPorPagina;
  const fin = inicio + this.itemsPorPagina;

  this.productosPaginados = this.productosFiltrados.slice(inicio, fin);
}

paginaAnterior() {
  if (this.paginaActual > 0) {
    this.paginaActual--;
    this.actualizarPaginacion();
  }
}

paginaSiguiente() {
  if (this.paginaActual < this.totalPaginas - 1) {
    this.paginaActual++;
    this.actualizarPaginacion();
  }
}
  abrirModal(producto: Producto) {
    this.productoEdit = { ...producto };
    this.imagenNueva = null;
    this.imagenPreview = null;

    const modalElement = document.getElementById('modalEditarProducto');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  onImagenSeleccionada(event: any) {
    this.imagenNueva = event.target.files[0] ?? null;
    if (!this.imagenNueva) return;

    const reader = new FileReader();
    reader.onload = (e) => (this.imagenPreview = e.target?.result as string);
    reader.readAsDataURL(this.imagenNueva);
  }

  guardarCambios() {
    const formData = new FormData();

    formData.append('nombre_producto', this.productoEdit.nombreProducto);
    formData.append('precio', this.productoEdit.precio);
    formData.append(`stock`, this.productoEdit.stock);
    formData.append('categoria', this.productoEdit.categoria);
    formData.append('formato_producto', this.productoEdit.formatoProducto);

    if (this.imagenNueva) {
      formData.append('imagen', this.imagenNueva);
    }

    this.sellerService
      .modificarProducto(this.productoEdit.id, formData)
      .subscribe({
        next: () => {
          this.modal.hide();
          this.cargarProductos(); // 🔹 recarga la lista después de modificar
        },
        error: (err) => console.error('Error al modificar producto', err),
      });
  }

  borrarProducto() {
    this.sellerService.borrarProducto(this.productoEdit.id).subscribe({
      next: () => {
        this.modal.hide();
        this.cargarProductos(); // 🔹 recarga la lista después de borrar
      },
      error: (err) => console.error('Error al borrar producto', err),
    });
  }
}

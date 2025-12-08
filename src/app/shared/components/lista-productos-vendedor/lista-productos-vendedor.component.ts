import { Component, Input, SimpleChanges } from '@angular/core';
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
  // Recibe los productos desde el padre
  @Input() productos: Producto[] = [];

  productoEdit: Producto | null = null;
  imagenNueva: File | null = null;
  imagenPreview: string | null = null;

  // Filtro y paginación
  busqueda: string = '';
  productosFiltrados: Producto[] = [];
  productosPaginados: Producto[] = [];
  paginaActual: number = 0;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;

  modal: any;

  constructor(private sellerService: SellerService) {}

  ngOnInit() {
    this.refrescarListado();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productos']) {
      this.refrescarListado();
    }
  }

  /** ✅ Recarga listado y aplica filtro + paginación */
  refrescarListado() {
    this.productosFiltrados = [...this.productos];
    this.filtrarProductos();
  }

  /** 🔎 Filtrar productos */
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

  /** 📄 Paginación */
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

  /** 🟩 Abrir modal */
  abrirModal(producto: Producto) {
    this.productoEdit = { ...producto } as Producto;
    this.imagenNueva = null;
    this.imagenPreview = null;

    const modalElement = document.getElementById('modalEditarProducto');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  /** 🖼 Nueva imagen */
  onImagenSeleccionada(event: any) {
    this.imagenNueva = event.target.files?.[0] ?? null;
    if (!this.imagenNueva) return;

    const reader = new FileReader();
    reader.onload = (e) => (this.imagenPreview = e.target?.result as string);
    reader.readAsDataURL(this.imagenNueva);
  }

  /** 💾 Guardar cambios */
  guardarCambios() {
    if (!this.productoEdit) return;

    const fd = new FormData();
    fd.append('nombre_producto', this.productoEdit.nombreProducto);
    fd.append('precio', this.productoEdit.precio.toString());
    fd.append('stock', this.productoEdit.stock.toString());
    fd.append('categoria', this.productoEdit.categoria);
    fd.append('formato_producto', this.productoEdit.formatoProducto);

    if (this.imagenNueva) {
      fd.append('imagen', this.imagenNueva);
    }

    this.sellerService.modificarProducto(this.productoEdit.id, fd).subscribe({
      next: () => {
        // Actualizar lista local sin recargar
        const index = this.productos.findIndex(
          (p) => p.id === this.productoEdit!.id
        );

        if (index !== -1) {
          this.productos[index] = { ...(this.productoEdit as Producto) };
        }

        this.refrescarListado();
        this.modal.hide();
      },
      error: (err) => console.error('Error al modificar producto', err),
    });
  }

  /* Eliminar producto */
  borrarProducto() {
    if (!this.productoEdit) return;

    this.sellerService.borrarProducto(this.productoEdit.id).subscribe({
      next: () => {
        //1
        // Quitar el producto de la lista SIN recargar
        this.productos = this.productos.filter(
          (p) => p.id !== this.productoEdit!.id
        );
        //2
        this.refrescarListado();

        //3
        this.modal.hide();
      },
      error: (err) => {
        console.error('Error al borrar producto', err);
        //1
        // Quitar el producto de la lista SIN recargar
        this.productos = this.productos.filter(
          (p) => p.id !== this.productoEdit!.id
        );
        //2
        this.refrescarListado();

        //3
        this.modal.hide();
      },
    });
  }
}

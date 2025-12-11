import { Component, ElementRef, ViewChild } from '@angular/core';
import { SellerService } from '../../shared/services/seller/seller.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../shared/models/Productos';
import { ListaProductosVendedorComponent } from '../../shared/components/lista-productos-vendedor/lista-productos-vendedor.component';
import { PedidosService } from '../../shared/services/pedidos/pedidos.service';
import { Pedido } from '../../shared/models/Pedidos';
declare var bootstrap: any;

@Component({
  selector: 'app-seller-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaProductosVendedorComponent],
  templateUrl: './seller-panel.component.html',
  styleUrl: './seller-panel.component.scss',
})
export class SellerPanelComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  listaProductos: Producto[] = [];
  pedidosVendedor: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];

  filtro: string = 'TODOS';

  pedidoSeleccionado: Pedido | null = null;
  modalPedido: any;

  producto: any = {
    nombre_producto: '',
    precio: null,
    formato_producto: '',
    categoria: '',
    stock: null,
  };

  // ===== MODAL CONFIRMACIÓN =====
  mensajeConfirmacion: string = '';
  accionARealizar: (() => void) | null = null;
  modalConfirmacion: any;

  imagen: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private vendedorService: SellerService,
    private pedidoService: PedidosService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarPedidosVendedor();
  }

  // ==================== PEDIDOS ====================
  cargarPedidosVendedor() {
    this.pedidoService.listarPedidosVendedor().subscribe({
      next: (data) => {
        this.pedidosVendedor = data.sort((a, b) => b.id - a.id);
        this.aplicarFiltro(this.filtro);
      },
      error: () => console.error('Error cargando pedidos del vendedor'),
    });
  }

  aplicarFiltro(estado: string) {
    this.filtro = estado;

    if (estado === 'TODOS') {
      this.pedidosFiltrados = [...this.pedidosVendedor];
    } else {
      this.pedidosFiltrados = this.pedidosVendedor.filter(
        (p) => p.estado === estado
      );
    }
  }

  abrirPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    const modalEl = document.getElementById('modalPedido');
    this.modalPedido = new bootstrap.Modal(modalEl);
    this.modalPedido.show();
  }

  cerrarModal() {
    if (this.modalPedido) this.modalPedido.hide();
  }

  // ========= FINALIZAR CON CONFIRMACIÓN =========
  solicitarFinalizarPedido(pedido: Pedido) {
    this.abrirConfirmacion(
      '¿Quieres marcar este pedido como FINALIZADO?',
      () => this.finalizarPedido(pedido)
    );
  }

  finalizarPedido(pedido: Pedido) {
    this.pedidoService.completarPedido(pedido.id).subscribe({
      next: () => {
        this.cargarPedidosVendedor();
        this.cerrarModal();
      },
      error: () => console.error('Error finalizando pedido'),
    });
  }

  // ========= CANCELAR CON CONFIRMACIÓN =========
  solicitarCancelarPedido(pedido: Pedido) {
    this.abrirConfirmacion(
      '¿Deseas cancelar este pedido?',
      () => this.cancelarPedido(pedido)
    );
  }

  cancelarPedido(pedido: Pedido) {
    this.pedidoService.cancelarPedido(pedido.id).subscribe({
      next: () => {
        this.cargarPedidosVendedor();
        this.cerrarModal();
      },
      error: () => console.error('Error cancelando pedido'),
    });
  }

  // ========= ELIMINAR CON CONFIRMACIÓN =========
  solicitarEliminarPedido(pedido: Pedido | null) {
    if (!pedido) return;

    this.abrirConfirmacion(
      '¿Seguro que deseas eliminar este pedido? Esta acción es irreversible.',
      () => this.eliminarPedido(pedido)
    );
  }

  eliminarPedido(pedido: Pedido) {
    this.pedidoService.eliminarPedido(pedido.id).subscribe({
      next: () => {
        this.cargarPedidosVendedor();
        this.cerrarModal();
      },
      error: () => console.error('Error eliminando el pedido'),
    });
  }

  // ==================== PRODUCTOS ====================
  cargarProductos() {
    this.vendedorService.listarProductos().subscribe({
      next: (data) => (this.listaProductos = [...data]),
      error: (err) =>
        console.error('Error al cargar la lista de productos', err),
    });
  }

  crearProducto() {
    if (
      !this.producto.nombre_producto ||
      this.producto.precio === null ||
      !this.producto.formato_producto ||
      !this.producto.categoria ||
      this.producto.stock === null ||
      !this.imagen
    ) {
      alert('Debes rellenar todos los campos antes de crear el producto.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_producto', this.producto.nombre_producto);
    formData.append('precio', this.producto.precio);
    formData.append('stock', this.producto.stock);
    formData.append('formato_producto', this.producto.formato_producto);
    formData.append('categoria', this.producto.categoria);
    formData.append('imagen', this.imagen);

    this.vendedorService.crearProducto(formData).subscribe({
      next: () => {
        this.cargarProductos();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('crearProductoModal')
        );
        modal?.hide();

        this.producto = {
          nombre_producto: '',
          precio: null,
          formato_producto: '',
          categoria: '',
          stock: null,
        };
        this.imagen = null;
        this.imagenPreview = null;
      },
      error: () => alert('Error al crear el producto'),
    });
  }

  // ==================== IMAGEN ====================
  onDragOver(event: DragEvent) {
    event.preventDefault();
    (event.target as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    (event.target as HTMLElement).classList.remove('dragover');
    if (event.dataTransfer?.files.length)
      this.setImage(event.dataTransfer.files[0]);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.setImage(file);
  }

  setImage(file: File) {
    this.imagen = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.imagenPreview = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') event.preventDefault();
  }

  // ==================== MODAL CONFIRMACIÓN ====================
  abrirConfirmacion(mensaje: string, accion: () => void) {
    this.mensajeConfirmacion = mensaje;
    this.accionARealizar = accion;

    const modalEl = document.getElementById('modalConfirmacion');
    this.modalConfirmacion = new bootstrap.Modal(modalEl);
    this.modalConfirmacion.show();
  }

  ejecutarAccionConfirmada() {
    if (this.accionARealizar) {
      this.accionARealizar();
    }
    if (this.modalConfirmacion) {
      this.modalConfirmacion.hide();
    }
  }
}

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
  constructor(private vendedorService: SellerService, private pedidoService: PedidosService) {}

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  listaProductos: Producto[] = [];
  listaProductoss: Producto[] = [];
  pedidosVendedor: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  modalPedido: any;

  producto: any = {
    nombre_producto: '',
    precio: null,
    formato_producto: '',
    categoria: '',
  };

  imagen: File | null = null;
  imagenPreview: string | null = null;

  ngOnInit(){
    this.cargarProductos()
    this.cargarPedidosVendedor();
  }

  cargarPedidosVendedor() {
    // Obtener pedidos en curso y finalizados
    this.pedidoService.listarPedidosEnCurso().subscribe({
      next: (enCurso) => {
        this.pedidoService.listarPedidosFinalizados().subscribe({
          next: (finalizados) => {
            const todos = [...enCurso, ...finalizados];
            // Filtrar pedidos que contienen productos del vendedor
            this.pedidosVendedor = todos.filter(p =>
              p.productos.some(prod => prod.usuario.id === /* ID del vendedor actual */ 1)
            );
          },
          error: () => console.error('Error cargando pedidos finalizados')
        });
      },
      error: () => console.error('Error cargando pedidos en curso')
    });
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

  finalizarPedido(pedido: Pedido) {
    this.pedidoService.completarPedido(pedido.id).subscribe({
      next: () => {
        this.cargarPedidosVendedor();
        this.cerrarModal();
      },
      error: () => console.error('Error finalizando pedido')
    });
  }

  cancelarPedido(pedido: Pedido) {
    this.pedidoService.cancelarPedido(pedido.id).subscribe({
      next: () => {
        this.cargarPedidosVendedor();
        this.cerrarModal();
      },
      error: () => console.error('Error cancelando pedido')
    });
  }
  cargarProductos() {
    this.vendedorService.listarProductos().subscribe({
      next: (data) => {
        this.listaProductos = [...data];
        console.log('carga')
      },
      error: (err) => {
        console.error('Error al cargar la lista de productos', err);
      },
    });
  }
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

    if (event.dataTransfer?.files.length) {
      this.setImage(event.dataTransfer.files[0]);
    }
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
  crearProducto() {
    //VALIDACIÓN COMPLETA
    if (
      !this.producto.nombre_producto ||
      !this.producto.precio ||
      !this.producto.formato_producto ||
      !this.producto.categoria ||
      !this.producto.stock ||
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

        //RECARGAR LISTA DE PRODUCTOS
        this.cargarProductos();

        //CERRAR MODAL
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('crearProductoModal')
        );
        modal?.hide();
        // RESETEAR FORMULARIO
        this.producto = {
          nombre_producto: '',
          precio: null,
          formato_producto: '',
          categoria: '',
          stock: null
        };
        this.imagen = null;
        this.imagenPreview = null;
      },
      error: () => {
        alert('Error al crear el producto');
      },
    });
    this.cargarProductos();
  }
  preventNegative(event: KeyboardEvent) {
  // Evita escribir "-" y "e" en inputs numéricos
  if (event.key === '-' || event.key === 'e') {
    event.preventDefault();
  }
}

}

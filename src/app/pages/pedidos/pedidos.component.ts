import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosService } from './../../shared/services/pedidos/pedidos.service';
import { Pedido } from '../../shared/models/Pedidos';

declare var bootstrap: any;

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidosPaginados: Pedido[] = [];

  pedidoSeleccionado: Pedido | null = null;
  modalPedido: any;

  filtro: 'TODOS' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO' = 'TODOS';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(private pedidosService: PedidosService){}

  ngOnInit() {
    this.listarTodosPedidos();
  }

  listarTodosPedidos() {
    this.pedidosService.listarPedidosEnCurso().subscribe({
      next: enCurso => {
        this.pedidosService.listarPedidosFinalizados().subscribe({
          next: finalizados => {
            this.pedidos = [...enCurso, ...finalizados];
            this.aplicarFiltro(this.filtro);
          },
          error: () => console.error('Error cargando pedidos finalizados')
        });
      },
      error: () => console.error('Error cargando pedidos en curso')
    });
  }

  aplicarFiltro(f: 'TODOS' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO') {
    this.filtro = f;
    this.paginaActual = 1;
    if (f === 'TODOS') {
      this.pedidosFiltrados = [...this.pedidos];
    } else {
      this.pedidosFiltrados = this.pedidos.filter(p => p.estado === f);
    }
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const start = (this.paginaActual - 1) * this.elementosPorPagina;
    const end = start + this.elementosPorPagina;
    this.pedidosPaginados = this.pedidosFiltrados.slice(start, end);
  }

  totalPaginas(): number {
    return Math.ceil(this.pedidosFiltrados.length / this.elementosPorPagina) || 1;
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
      this.actualizarPaginacion();
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

  cancelarPedido(pedido: Pedido) {
    if (!pedido || pedido.estado !== 'EN_CURSO') return;

    this.pedidosService.cancelarPedido(pedido.id).subscribe({
      next: () => {
        this.listarTodosPedidos();
        this.cerrarModal();
      },
      error: () => console.error('Error cancelando pedido')
    });
  }

}

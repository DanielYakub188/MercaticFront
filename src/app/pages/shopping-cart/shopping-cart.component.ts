import { Component, OnInit } from '@angular/core';
import { Carrito } from '../../shared/models/Carrito';
import { ClienteService } from '../../shared/services/cliente/cliente.service';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../shared/services/pedidos/pedidos.service';
import { Pedido } from '../../shared/models/Pedidos';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit {
  carrito: Carrito[] = [];
  comprando: boolean = false; // Para mostrar loading al comprar
  balanceCuenta: number = 0; // Balance del usuario
  envio: number = 5; // 5 euros de envío

  constructor(
    private clienteService: ClienteService,
    private pedidoService: PedidosService
  ) {}

  ngOnInit() {
    this.recogerListaCarrito();
    this.obtenerBalanceCuenta();
  }

  recogerListaCarrito() {
    this.clienteService.listarCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
      },
      error: () => {
        console.log('Error cargando carrito');
      },
    });
  }

  obtenerBalanceCuenta() {
    // Suponemos que el servicio devuelve un número con el balance
    this.clienteService.obtenerBalance().subscribe({
      next: (balance) => (this.balanceCuenta = balance),
      error: () => console.error('Error obteniendo balance'),
    });
  }

  sumarUnidad(item: Carrito) {
    if (item.unidades >= item.producto.stock) return;

    this.clienteService.añadirProductoCarrito(item.producto.id, 1).subscribe({
      next: () => this.recogerListaCarrito(),
    });
  }

  restarUnidad(item: Carrito) {
    if (item.unidades > 1) {
      this.clienteService
        .añadirProductoCarrito(item.producto.id, -1)
        .subscribe({
          next: () => this.recogerListaCarrito(),
        });
    } else {
      this.eliminar(item);
    }
  }

  eliminar(item: Carrito) {
    this.clienteService.eliminarDelCarrito(item.producto.id).subscribe({
      next: () => this.recogerListaCarrito(),
    });
  }

  comprarCarrito() {
    if (
      this.carrito.length === 0 ||
      this.totalCarrito() + this.envio > this.balanceCuenta
    )
      return;

    this.comprando = true;

    this.clienteService.comprarCarrito().subscribe({
      next: (pedidoCreado) => {
        console.log('Pedido creado:', pedidoCreado);
        // Vaciar carrito local
        this.carrito = [];
        this.comprando = false;
      },
      error: () => {
        console.error('Error al crear pedido desde carrito');
        this.comprando = false;
      },
    });
  }

  totalCarrito(): number {
    return this.carrito.reduce(
      (sum, item) => sum + item.producto.precio * item.unidades,
      0
    );
  }

  puedeComprar(): boolean {
    return (
      this.totalCarrito() + this.envio <= this.balanceCuenta &&
      this.carrito.length > 0
    );
  }
}

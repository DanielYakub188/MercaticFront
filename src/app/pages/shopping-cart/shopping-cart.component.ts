import { Component, OnInit } from '@angular/core';
import { Carrito } from '../../shared/models/Carrito';
import { ClienteService } from '../../shared/services/cliente/cliente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent implements OnInit {

  carrito: Carrito[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.recogerListaCarrito();
  }

  recogerListaCarrito() {
    this.clienteService.listarCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
      },
      error: () => {
        console.log("Error cargando carrito");
      }
    });
  }

  sumarUnidad(item: Carrito) {
    this.clienteService.añadirProductoCarrito(item.producto.id, 1).subscribe({
      next: () => this.recogerListaCarrito()
    });
  }

  restarUnidad(item: Carrito) {
    if (item.unidades > 1) {
      this.clienteService.añadirProductoCarrito(item.producto.id, -1).subscribe({
        next: () => this.recogerListaCarrito()
      });
    } else {
      this.eliminar(item);
    }
  }

  eliminar(item: Carrito) {
    this.clienteService.eliminarDelCarrito(item.producto.id).subscribe({
      next: () => this.recogerListaCarrito()
    });
  }
}

import { ClienteService } from './../../../services/cliente/cliente.service';
import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../../models/Productos';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  constructor(private ClienteService: ClienteService) {}

  @Input() productos: Producto[] = [];

  visibleCount: number = 8; // 2 filas (4 por fila)
  isExpanded: boolean = false;

  usuarioLogeado: boolean = false;

  private modalNoLogin: any;

  ngOnInit(): void {
    this.usuarioLogeado = !!localStorage.getItem('id');
  }

  get productosVisibles(): Producto[] {
    return this.productos.slice(0, this.visibleCount);
  }

  toggleVerMas() {
    if (this.isExpanded) {
      this.visibleCount = 8;
      this.isExpanded = false;
    } else {
      this.visibleCount = this.productos.length;
      this.isExpanded = true;
    }
  }

  anadirCarrito(producto: Producto) {
    if (!this.usuarioLogeado) {
      this.abrirModalNoLogin();
      return;
    }

    this.ClienteService.añadirProductoCarrito(producto.id, 1).subscribe({
      next: () => {
        console.log(`Producto añadido correctamente, Producto: ${producto.id}`)
        this.animacionAñadido(producto.id);
      },
      error: () => {
        console.error('Error añadiendo al carrito');
      },
    });
  }

  animacionAñadido(idProducto: number) {
    const card = document.getElementById('card-' + idProducto);
    if (!card) return;

    card.classList.add('added');

    setTimeout(() => {
      card.classList.remove('added');
    }, 900);
  }

  abrirModalNoLogin() {
    const modalElement = document.getElementById('modalNoLogin');
    this.modalNoLogin = new bootstrap.Modal(modalElement);
    this.modalNoLogin.show();
  }
}

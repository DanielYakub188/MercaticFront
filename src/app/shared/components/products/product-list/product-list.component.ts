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

  @Input() productos: Producto[] = [];

  visibleCount: number = 8; // 2 filas (4 por fila)
  isExpanded: boolean = false;

  usuarioLogeado: boolean = false;

  private modalNoLogin: any;

  ngOnInit(): void {
    this.usuarioLogeado = !!localStorage.getItem("usuario");
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

    console.log("Producto añadido al carrito:", producto);

    // Aquí luego puedes meter el servicio de carrito real
  }

  abrirModalNoLogin() {
    const modalElement = document.getElementById('modalNoLogin');
    this.modalNoLogin = new bootstrap.Modal(modalElement);
    this.modalNoLogin.show();
  }
}

import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from '../../shared/components/products/product-list/product-list.component';
import { Producto } from '../../shared/models/Productos';
import { ClienteService } from '../../shared/services/cliente/cliente.service';
import { CommonModule} from '@angular/common';
import { Subject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductListComponent, CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  productos: Producto[] = [];
  noResultados: boolean = false;

  searchText: string = "";
  private searchSubject = new Subject<string>();

  categoriaSeleccionada: string = ""; // '' significa todos

  constructor(private clienteService: ClienteService) {
    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(text => this.buscarProductos(text));
  }

  ngOnInit(): void {
    this.buscarProductos(""); // carga inicial
  }

  // cuando ngModel cambie → enviar a Subject
  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.buscarProductos(this.searchText); // vuelve a filtrar
  }

  private buscarProductos(nombre: string) {
    this.clienteService.recogerProductosBusqueda(nombre)
      .subscribe({
        next: res => {
          // filtrar por categoría si hay alguna seleccionada
          if (this.categoriaSeleccionada) {
            this.productos = res.filter(p => p.categoria === this.categoriaSeleccionada);
          } else {
            this.productos = res;
          }
          this.noResultados = (this.productos.length === 0);
        },
        error: err => console.error(err)
      });
  }

}

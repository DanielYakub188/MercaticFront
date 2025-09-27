import { Component } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent,CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
     products: Product[] = [
    { id: 1, vendedor_id: 101, nombre_producto: 'Barritas de cereales con galleta animada Hacendado', precio: 1.55, formato: 'Caja 6 barritas (120 g)' },
    { id: 2, vendedor_id: 102, nombre_producto: 'Petit de bolsillo de fresa Hacendado', precio: 1.70, formato: 'Caja 4 ud. (360 g)' },
    { id: 3, vendedor_id: 103, nombre_producto: 'Queso en porciones Hacendado', precio: 2.15, formato: 'Caja 24 quesitos (375 g)' },
    { id: 4, vendedor_id: 104, nombre_producto: 'Bebida 5 frutas Hacendado sin azúcares añadidos', precio: 1.75, formato: '6 mini bricks x 200 ml' },
    { id: 5, vendedor_id: 105, nombre_producto: 'Loción infantil elimina liendres y piojos Deliplus', precio: 5.00, formato: 'Bote 150 ml' },
    { id: 6, vendedor_id: 106, nombre_producto: 'Lote infantil Dragona Iris', precio: 11.00, formato: '1 ud.' }
  ];
}

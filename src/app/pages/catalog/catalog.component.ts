import { Component } from '@angular/core';
import { ProductListComponent } from '../../shared/components/products/product-list/product-list.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductListComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

}

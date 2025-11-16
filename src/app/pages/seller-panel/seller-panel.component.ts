import { Component, ElementRef, ViewChild } from '@angular/core';
import { SellerService } from '../../shared/services/seller/seller.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-panel.component.html',
  styleUrl: './seller-panel.component.scss',
})
export class SellerPanelComponent {
  constructor(private vendedorService: SellerService) {}

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  producto: any = {
    nombre_producto: '',
    precio: null,
    formato_producto: '',
    categoria: '',
  };

  imagen: File | null = null;
  imagenPreview: string | null = null;


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
    if (!this.imagen) {
      alert('Debes subir una imagen');
      return;
    }

    const formData = new FormData();

    formData.append('nombre_producto', this.producto.nombre_producto);
    formData.append('precio', this.producto.precio);
    formData.append('formato_producto', this.producto.formato_producto);
    formData.append('categoria', this.producto.categoria);
    formData.append('imagen', this.imagen);

    this.vendedorService.crearProducto(formData).subscribe((res) => {
      alert('Producto creado con éxito');
    });
  }
}

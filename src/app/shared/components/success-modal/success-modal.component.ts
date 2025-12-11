import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent {
  @Input() title = 'Éxito';
  @Input() message = '';
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}

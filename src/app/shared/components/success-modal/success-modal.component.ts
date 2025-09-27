import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent {

  @Input() title: string = 'Éxito';
  @Input() message: string = 'La operación se realizó correctamente.';
}

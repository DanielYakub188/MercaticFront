import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  standalone:true,
  imports:[],
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {

  @Input() title: string = 'Error';
  @Input() message: string = 'Ha ocurrido un error inesperado.';

  @Output() closed = new EventEmitter<void>(); // 👈 para avisar al padre

  constructor() { }
    close() {
    this.closed.emit();
  }


  ngOnInit() {
  }

}

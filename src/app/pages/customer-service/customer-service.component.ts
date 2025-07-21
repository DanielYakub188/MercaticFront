import { Component } from '@angular/core';
import { TicketFormComponent } from '../../shared/components/ticket-form/ticket-form.component';

@Component({
  selector: 'app-customer-service',
  standalone: true,
  imports: [TicketFormComponent],
  templateUrl: './customer-service.component.html',
  styleUrl: './customer-service.component.scss'
})
export class CustomerServiceComponent {

}

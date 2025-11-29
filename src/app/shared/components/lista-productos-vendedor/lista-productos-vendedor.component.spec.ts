import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductosVendedorComponent } from './lista-productos-vendedor.component';

describe('ListaProductosVendedorComponent', () => {
  let component: ListaProductosVendedorComponent;
  let fixture: ComponentFixture<ListaProductosVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductosVendedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaProductosVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

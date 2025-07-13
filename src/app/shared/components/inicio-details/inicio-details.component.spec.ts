import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioDetailsComponent } from './inicio-details.component';

describe('InicioDetailsComponent', () => {
  let component: InicioDetailsComponent;
  let fixture: ComponentFixture<InicioDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

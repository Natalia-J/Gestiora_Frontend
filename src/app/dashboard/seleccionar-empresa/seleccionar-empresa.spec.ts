import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarEmpresa } from './seleccionar-empresa';

describe('SeleccionarEmpresa', () => {
  let component: SeleccionarEmpresa;
  let fixture: ComponentFixture<SeleccionarEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

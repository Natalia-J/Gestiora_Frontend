import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAdicionales } from './datos-adicionales';

describe('DatosAdicionales', () => {
  let component: DatosAdicionales;
  let fixture: ComponentFixture<DatosAdicionales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosAdicionales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAdicionales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

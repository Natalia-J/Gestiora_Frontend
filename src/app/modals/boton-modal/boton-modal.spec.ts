import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonModal } from './boton-modal';

describe('BotonModal', () => {
  let component: BotonModal;
  let fixture: ComponentFixture<BotonModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

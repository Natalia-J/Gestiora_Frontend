import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prenomina } from './prenomina';

describe('Prenomina', () => {
  let component: Prenomina;
  let fixture: ComponentFixture<Prenomina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prenomina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prenomina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

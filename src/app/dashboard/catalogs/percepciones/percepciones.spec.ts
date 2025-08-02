import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Percepciones } from './percepciones';

describe('Percepciones', () => {
  let component: Percepciones;
  let fixture: ComponentFixture<Percepciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Percepciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Percepciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

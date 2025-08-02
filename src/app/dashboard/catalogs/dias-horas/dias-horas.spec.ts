import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasHoras } from './dias-horas';

describe('DiasHoras', () => {
  let component: DiasHoras;
  let fixture: ComponentFixture<DiasHoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiasHoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiasHoras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

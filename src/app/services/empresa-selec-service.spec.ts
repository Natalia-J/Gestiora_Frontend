import { TestBed } from '@angular/core/testing';

import { EmpresaSelecService } from './empresa-selec-service';

describe('EmpresaSelecService', () => {
  let service: EmpresaSelecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpresaSelecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

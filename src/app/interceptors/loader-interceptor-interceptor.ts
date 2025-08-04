import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader-service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loaderInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
 const loaderService = inject(LoaderService);
  
  // Mostrar loader
  loaderService.show();
  
  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
    })
  );
};

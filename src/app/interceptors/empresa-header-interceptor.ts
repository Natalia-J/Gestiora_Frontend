import { HttpInterceptorFn } from '@angular/common/http';

export const empresaHeaderInterceptor: HttpInterceptorFn = (req, next) => {
 const empresaId = localStorage.getItem('empresaId');
  if (empresaId) {
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Empresa-Id': empresaId
      }
    });
    
    return next(modifiedReq);
  }
  
  return next(req);
};

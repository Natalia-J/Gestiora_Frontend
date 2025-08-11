import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  let router = inject(Router)

  if (token) {
    return true;
  } else {
  router.navigate(["/login"])
    return false;
  }
};
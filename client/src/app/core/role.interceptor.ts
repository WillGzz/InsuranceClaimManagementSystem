import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RoleService } from '../services/role.service';

export const roleHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const roleSvc = inject(RoleService);
  const role = roleSvc.role();
  return next(req.clone({ setHeaders: { 'X-Role': role } }));
};

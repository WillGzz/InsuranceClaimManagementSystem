import { Injectable, signal } from '@angular/core';

export type Role = 'Customer' | 'Manager' | 'Adjuster' | 'Auditor';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly _role = signal<Role>('Customer');
  private readonly _roles = signal<Role[]>(['Customer','Manager', 'Adjuster', 'Auditor']);

  role = this._role.asReadonly();
  roles = this._roles.asReadonly();

  setRole(next: Role): void {
    this._role.set(next);
  }
}

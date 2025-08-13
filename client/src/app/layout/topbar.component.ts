import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <header class="w-full border-b bg-white">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <span class="font-semibold">Claims Portal</span>

        <nav class="flex gap-3">
          <a routerLink="/claims" class="text-sm hover:underline">Claims</a>
          <a routerLink="/claims/new" class="text-sm hover:underline">New Claim</a>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <label class="text-sm text-gray-600">Role</label>
          <select
            class="cursor-pointer border rounded px-2 py-1 text-sm"
            [value]="role()"
            (change)="onRoleChange($event)">
            @for (r of roles(); track r) {
              <option [value]="r">{{ r }}</option>
            }
          </select>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <router-outlet />
    </main>
  `
})
export class TopbarComponent {
  private roleSvc = inject(RoleService);
  readonly roles = this.roleSvc.roles;
  readonly role  = this.roleSvc.role;
  readonly roleLabel = computed(() => `Role: ${this.role()}`);

  onRoleChange(e: Event): void {
    const next = (e.target as HTMLSelectElement)?.value as any;
    this.roleSvc.setRole(next);
  }
}


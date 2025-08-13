import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, NgIf } from '@angular/common';
import { Claim, ClaimService } from '../../services/claim.service';
import { RoleService } from '../../services/role.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-claims-list',
  imports: [RouterLink, DecimalPipe, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-4 gap-3">
      <h2 class="text-xl font-semibold">Claims</h2>
      <div class="flex-1"></div>
      <input
        class="px-3 py-2 border rounded w-72"
        placeholder="Search by id, policy, status…"
        [value]="q()"
        (input)="onSearch($event)" />
      <a routerLink="/claims/new" class="px-3 py-2 rounded bg-blue-600 text-white text-sm">+ New Claim</a>
    </div>

    @if (rows(); as list) {
      <table class="w-full border text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-2 border text-left">ID</th>
            <th class="p-2 border text-left">Policy</th>
            <th class="p-2 border text-left">Loss Date</th>
            <th class="p-2 border text-left">Amount</th>
            <th class="p-2 border text-left">Status</th>
            <th class="p-2 border text-left">Risk</th>
            <th class="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          @for (c of list; track c.id) {
            <tr class="odd:bg-white even:bg-gray-50">
              <td class="p-2 border">{{ c.id }}</td>
              <td class="p-2 border">{{ c.policyNumber }}</td>
              <td class="p-2 border">{{ c.lossDate }}</td>
              <td class="p-2 border">{{ c.amount | number:'1.2-2' }}</td>
              <td class="p-2 border"><span class="px-2 py-0.5 rounded bg-gray-200">{{ c.status }}</span></td>
              <td class="p-2 border">
                <span class="px-2 py-0.5 rounded" [class]="riskClass(c.riskScore ?? 0)">
                  {{ riskLabel(c.riskScore ?? 0) }}
                </span>
              </td>
              <td class="p-2 border text-right space-x-3">
                <a [routerLink]="['/claims', c.id]" class="text-blue-600 hover:underline">Open</a>
                <button *ngIf="roleSvc.role()==='Manager'"
                        class="text-red-600 hover:underline cursor-pointer"
                        (click)="onDelete(c.id)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    } @else {
      <div class="text-sm text-gray-600">Loading…</div>
    }
  `
})
export class ClaimsListComponent {
  private api = inject(ClaimService);
  readonly roleSvc = inject(RoleService);

  private readonly _claims$ = this.api.list();
  private readonly _claims = toSignal<Claim[] | null>(this._claims$, { initialValue: null });

  q = signal('');

  rows = computed(() => {
    const data = this._claims();
    if (!data) return null;
    const term = this.q().trim().toLowerCase();
    if (!term) return data;
    return data.filter(c =>
      (`${c.id}`).includes(term) ||
      (c.policyNumber ?? '').toLowerCase().includes(term) ||
      (c.status ?? '').toLowerCase().includes(term) ||
      (c.assignee ?? '').toLowerCase().includes(term)
    );
  });

  onSearch(e: Event) {
    const v = (e.target as HTMLInputElement)?.value ?? '';
    this.q.set(v);
  }

  onDelete(id: number) {
    if (!confirm(`Delete claim #${id}?`)) return;
    this.api.delete(id).subscribe({
      next: () => {
        const cur = this._claims();
        if (cur) (this as any)._claims.set(cur.filter(c => c.id !== id));
      },
      error: err => alert('Delete failed (check role/server): ' + (err?.error?.message ?? err.statusText ?? err))
    });
  }

  riskLabel = (r: number) => r >= 61 ? 'HIGH' : r >= 31 ? 'MED' : 'LOW';
  riskClass = (r: number) =>
    r >= 61 ? 'bg-red-100 text-red-700' : r >= 31 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
}


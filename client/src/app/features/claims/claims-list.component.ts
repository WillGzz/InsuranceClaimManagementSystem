import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, NgIf } from '@angular/common';
import { Claim, ClaimService } from '../../services/claim.service';
import { RoleService } from '../../services/role.service';
import { ClaimStatus } from '../../services/claim.service';

import { HttpClient } from '@angular/common/http';

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

      @if (roleSvc.role()==='Auditor') {
        <button class="px-3 py-2 rounded border text-sm cursor-pointer" (click)="exportCsv()">
          Export CSV
        </button>
      }

      <button *ngIf="roleSvc.role()==='Manager'"
        class="px-3 py-2 rounded bg-rose-600 text-white text-sm cursor-pointer"
        (click)="resetData()">
        Reset Seed Data
     </button>


      @if (roleSvc.role() !== 'Auditor' && roleSvc.role() !== 'Adjuster') {
      <a routerLink="/claims/new" class="px-3 py-2 rounded bg-blue-600 text-white text-sm cursor-pointer">+ New Claim</a>
      }
      </div>

    @if (rows().length; as _len) {
      <table class="w-full border text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-2 border text-left">ID</th>
            <th class="p-2 border text-left">Policy</th>
            <th class="p-2 border text-left">Loss Date</th>
            <th class="p-2 border text-left">Amount</th>
            <th class="p-2 border text-left">Status</th>

            <!-- Risk header hidden for Customer -->
            @if (roleSvc.role() !== 'Customer') {
              <th class="p-2 border text-left">Risk</th>
            }

            <th class="p-2 border"></th>
          </tr>
        </thead>
        <tbody>
          @for (c of rows(); track c.id) {
            <tr class="odd:bg-white even:bg-gray-50">
              <td class="p-2 border">{{ c.id }}</td>
              <td class="p-2 border">{{ c.policyNumber }}</td>
              <td class="p-2 border">{{ c.lossDate }}</td>
              <td class="p-2 border">{{ c.amount | number:'1.2-2' }}</td>
              <td class="p-2 border">
                <span class="px-2 py-0.5 rounded" [class]="statusClass(c.status)">
                  {{ c.status }}
                </span>
              </td>

              <!-- Risk cell hidden for Customer -->
              @if (roleSvc.role() !== 'Customer') {
                <td class="p-2 border">
                  <span class="px-2 py-0.5 rounded" [class]="riskClass(c.riskScore ?? 0)">
                    {{ riskLabel(c.riskScore ?? 0) }}
                  </span>
                </td>
              }

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
      <div class="text-sm text-gray-600">No claims yet.</div>
    }
  `
})
export class ClaimsListComponent {
  private api = inject(ClaimService);
  readonly roleSvc = inject(RoleService);
  private http = inject(HttpClient);
  // writable list we can update
  private all = signal<Claim[]>([]);
  q = signal('');

  constructor() {
    this.api.list().subscribe(list => this.all.set(list ?? []));
  }

  rows = computed(() => {
    const term = this.q().trim().toLowerCase();
    const data = this.all();
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

  resetData() {
  if (!confirm("Reset all claims and policies to seed data?")) return;

  this.http.post('/api/reset', {}, { responseType: 'text' }).subscribe({
    next: () => this.api.list().subscribe(list => this.all.set(list ?? [])),
    error: (err: any) => alert('Reset failed: ' + (err?.error?.message ?? err.statusText ?? err))
  });

}

  statusClass = (s: ClaimStatus) =>
    ({
      NEW:       'bg-sky-100 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800/60',
      IN_REVIEW: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800/60',
      APPROVED:  'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800/60',
      DENIED:    'bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-800/60',
      CLOSED:    'bg-slate-200 text-slate-700 ring-1 ring-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:ring-slate-800/60',
    } as const)[s] ?? 'bg-gray-200 text-gray-700 ring-1 ring-gray-300';

  onDelete(id: number) {
    if (!confirm(`Delete claim #${id}?`)) return;
    this.api.delete(id).subscribe({
      next: () => this.all.update(arr => arr.filter(c => c.id !== id)),
      error: err => alert('Delete failed (check role/server): ' + (err?.error?.message ?? err.statusText ?? err))
    });
  }

  riskLabel = (r: number) => r >= 61 ? 'HIGH' : r >= 31 ? 'MED' : 'LOW';
  riskClass = (r: number) =>
    r >= 61 ? 'bg-red-100 text-red-700' : r >= 31 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';

  // Auditor: CSV export (exports currently visible rows)
  exportCsv() {
    const items = this.rows();
    if (!items.length) {
      alert('No rows to export.');
      return;
    }

    const esc = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const header = ['id','policyNumber','lossDate','amount','status','assignee','riskScore'];
    const lines = [header.join(',')];

    for (const c of items) {
      lines.push([
        esc(c.id),
        esc(c.policyNumber),
        esc(c.lossDate),
        esc(c.amount),
        esc(c.status),
        esc(c.assignee ?? ''),
        esc((c as any).riskScore ?? '')
      ].join(','));
    }

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().slice(0,10);
    a.download = `claims-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}

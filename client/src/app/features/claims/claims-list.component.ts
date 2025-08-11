import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Claim, ClaimService } from '../../services/claim.service';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-claims-list',
  imports: [RouterLink, AsyncPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Claims</h2>
      <a routerLink="/claims/new" class="px-3 py-2 rounded bg-blue-600 text-white text-sm">+ New Claim</a>
    </div>

    @if (claims(); as rows) {
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
          @for (c of rows; track c.id) {
            <tr class="odd:bg-white even:bg-gray-50">
              <td class="p-2 border">{{ c.id }}</td>
              <td class="p-2 border">{{ c.policyNumber }}</td>
              <td class="p-2 border">{{ c.lossDate }}</td>
              <td class="p-2 border">{{ c.amount | number:'1.2-2' }}</td>
              <td class="p-2 border"><span class="px-2 py-0.5 rounded bg-gray-200">{{ c.status }}</span></td>
              <td class="p-2 border">
                <span class="px-2 py-0.5 rounded"
                      [class]="riskClass(c.riskScore ?? 0)">{{ riskLabel(c.riskScore ?? 0) }}</span>
              </td>
              <td class="p-2 border text-right">
                <a [routerLink]="['/claims', c.id]" class="text-blue-600 hover:underline">Open</a>
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
  private readonly _claims$ = this.api.list();
  readonly claims = toSignal<Claim[] | null>(this._claims$, { initialValue: null });

  riskLabel = (r: number) => r >= 61 ? 'HIGH' : r >= 31 ? 'MED' : 'LOW';
  riskClass = (r: number) =>
    r >= 61 ? 'bg-red-100 text-red-700' : r >= 31 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
}

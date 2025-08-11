import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimService, Claim, UpdateClaimDto, ClaimStatus } from '../../services/claim.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-claim-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (claim(); as c) {
      <h2 class="text-xl font-semibold mb-4">Claim #{{ c.id }}</h2>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="p-3 border rounded">
          <div><span class="text-gray-500">Policy:</span> <b>{{ c.policyNumber }}</b></div>
          <div><span class="text-gray-500">Status:</span> {{ c.status }}</div>
          <div><span class="text-gray-500">Risk:</span>
            <span class="px-2 py-0.5 rounded"
                  [class]="(c.riskScore ?? 0) >= 61 ? 'bg-red-100 text-red-700'
                           : (c.riskScore ?? 0) >= 31 ? 'bg-amber-100 text-amber-700'
                           : 'bg-green-100 text-green-700'">
              {{ (c.riskScore ?? 0) >= 61 ? 'HIGH' : (c.riskScore ?? 0) >= 31 ? 'MED' : 'LOW' }}
            </span>
          </div>
          <div><span class="text-gray-500">Loss:</span> {{ c.lossDate }}</div>
          <div><span class="text-gray-500">Reported:</span> {{ c.reportedDate }}</div>
          <div><span class="text-gray-500">Amount:</span> {{ c.amount | number:'1.2-2' }}</div>
          @if (c.slaDueAt) { <div><span class="text-gray-500">SLA Due:</span> {{ c.slaDueAt }}</div> }
        </div>

        <div class="p-3 border rounded">
          <div class="mb-2">
            <label class="block text-sm text-gray-700 mb-1">Update Status</label>
            <select class="w-full border rounded px-3 py-2"
                    [value]="status()"
                    (change)="status.set(($event.target as HTMLSelectElement).value as ClaimStatus)">
              @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm text-gray-700 mb-1">Assignee</label>
            <input class="w-full border rounded px-3 py-2"
                   [value]="assignee()"
                   (input)="assignee.set(($event.target as HTMLInputElement).value)">
          </div>
          <button class="px-3 py-2 rounded bg-blue-600 text-white" (click)="save()">Save</button>
        </div>
      </div>
    } @else {
      <div class="text-sm text-gray-600">Loading…</div>
    }
  `
})
export class ClaimDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ClaimService);

  // derive id from the route (readonly)
  readonly id = toSignal(
    this.route.paramMap.pipe(map(pm => Number(pm.get('id')))),
    { initialValue: 0 }
  );

  // writable signals
  readonly claim = signal<Claim | null>(null);
  readonly statuses: ClaimStatus[] = ['NEW','IN_REVIEW','APPROVED','DENIED','CLOSED'];
  readonly status = signal<ClaimStatus>('NEW');
  readonly assignee = signal<string>('');

  // fetch when id changes and sync local fields
  private load = effect(() => {
    const currentId = this.id();
    if (!currentId) return;
    this.api.get(currentId).subscribe(c => {
      this.claim.set(c);
      this.status.set(c.status);
      this.assignee.set(c.assignee ?? '');
    });
  });

  save(): void {
    const c = this.claim();
    if (!c) return;
    const body: UpdateClaimDto = {};
    const s = this.status(); if (s) body.status = s;
    const a = this.assignee(); if (a) body.assignee = a;

    this.api.update(c.id, body).subscribe(next => {
      // reflect server response locally
      this.claim.set(next);
      this.status.set(next.status);
      this.assignee.set(next.assignee ?? '');
    });
  }
}


import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService, Claim, UpdateClaimDto, ClaimStatus } from '../../services/claim.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, NgIf } from '@angular/common';
import { map } from 'rxjs/operators';
import { RoleService } from '../../services/role.service';

type StepKey = 'FILED' | 'REVIEW' | 'DECISION';

@Component({
  selector: 'app-claim-detail',
  imports: [DecimalPipe, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (claim(); as c) {
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Claim #{{ c.id }}</h2>

        <!-- Manager-only delete -->
        <button
          *ngIf="roleSvc.role()==='Manager'"
          class="px-3 py-2 rounded bg-red-600 text-white text-sm cursor-pointer"
          (click)="onDelete()">
          Delete
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- Summary -->
        <div class="p-3 border rounded">
          <div><span class="text-gray-500">Policy:</span> <b>{{ c.policyNumber }}</b></div>
          <div>
            <span class="text-gray-500">Status:</span>
            <span class="ml-1 px-2 rounded" [class]="statusClass(c.status)">{{ c.status }}</span>
          </div>
          @if (roleSvc.role() !== 'Customer') {
            <div>
              <span class="text-gray-500">Risk:</span>
              <span class="px-2 py-0.5 rounded"
                    [class]="(c.riskScore ?? 0) >= 61 ? 'bg-red-100 text-sm ml-1 pr-4 pt-0 text-red-700'
                             : (c.riskScore ?? 0) >= 31 ? 'bg-amber-100 text-sm ml-1 pr-4 pt-0 text-amber-700'
                             : 'bg-green-100 text-sm ml-1 pr-4 pt-0 pb-0.5 text-green-700'">
                {{ (c.riskScore ?? 0) >= 61 ? 'HIGH' : (c.riskScore ?? 0) >= 31 ? 'MED' : 'LOW' }}
              </span>
            </div>
          }
          <div><span class="text-gray-500">Loss:</span> {{ c.lossDate }}</div>
          <div><span class="text-gray-500">Reported:</span> {{ c.reportedDate }}</div>
          <div><span class="text-gray-500">Amount:</span> {{ c.amount | number:'1.2-2' }}</div>
          @if (c.slaDueAt) { <div><span class="text-gray-500">SLA Due:</span> {{ c.slaDueAt }}</div> }
        </div>

        <!-- Update form (hidden for Customer & Auditor) -->
        @if (roleSvc.role() !== 'Customer' && roleSvc.role() !== 'Auditor' && roleSvc.role() !== 'Adjuster') {
          <div class="p-3 border rounded">
            <div class="mb-2">
              <label class="block text-sm text-gray-700 mb-1">Update Status</label>
              <select class="w-full border rounded px-3 py-2"
                      [value]="status()"
                      (change)="onStatusChange($event)">
                @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm text-gray-700 mb-1">Assignee</label>
              <input class="w-full border rounded px-3 py-2"
                     [value]="assignee()"
                     (input)="onAssigneeInput($event)">
            </div>
            <button class="px-3 py-2 rounded bg-blue-600 text-white cursor-pointer" (click)="save()">Save</button>
          </div>
        }
      </div>

      <!-- Adjuster Tools -->
      @if (roleSvc.role()==='Adjuster') {
        <section class="border rounded p-4 mb-6">
          <h3 class="font-semibold mb-3">Adjuster Tools</h3>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Internal Note</label>
              <textarea rows="3" class="w-full border rounded px-3 py-2"
                        [value]="adjusterNote()"
                        (input)="onNoteInput($event)"
                        placeholder="Only visible to staff (not customers)"></textarea>
              <div class="mt-2">
                <button class="px-3 py-2 rounded border cursor-pointer"
                        (click)="addNote()">Add Note</button>
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-1">Preliminary Estimate (USD)</label>
              <input type="number" class="w-full border rounded px-3 py-2"
                     [value]="estimate() ?? ''"
                     (input)="onEstimateInput($event)">
              <div class="mt-2 space-x-2">
                <button class="px-3 py-2 rounded border cursor-pointer" (click)="saveEstimate()">Save Estimate</button>
                <button class="px-3 py-2 rounded bg-amber-600 text-white cursor-pointer" (click)="startReview()">Start Review</button>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Progress section -->
      <section class="border rounded p-4">
        <h3 class="font-semibold mb-3">Claim Progress</h3>
        <ul class="space-y-3">
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full" [class]="dot(stepDone('FILED'))"></span>
            <div class="flex-1">
              <div class="font-medium">Filed</div>
              <div class="text-xs text-gray-500">{{ c.reportedDate }}</div>
            </div>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full" [class]="dot(stepDone('REVIEW'))"></span>
            <div class="flex-1">
              <div class="font-medium">Under Review</div>
              <div class="text-xs text-gray-500">{{ c.updatedAt || '—' }}</div>
            </div>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full" [class]="dot(stepDone('DECISION'))"></span>
            <div class="flex-1">
              <div class="font-medium">Decision</div>
              <div class="text-xs text-gray-500">{{ c.updatedAt || '—' }}</div>
            </div>
          </li>
        </ul>
      </section>
    } @else {
      <div class="text-sm text-gray-600">Loading…</div>
    }
  `
})
export class ClaimDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ClaimService);
  private router = inject(Router);
  readonly roleSvc = inject(RoleService);

  readonly id = toSignal(this.route.paramMap.pipe(map(pm => Number(pm.get('id')))), { initialValue: 0 });

  readonly claim = signal<Claim | null>(null);
  readonly statuses: ClaimStatus[] = ['NEW','IN_REVIEW','APPROVED','DENIED','CLOSED'];
  readonly status = signal<ClaimStatus>('NEW');
  readonly assignee = signal<string>('');
  readonly adjusterNote = signal<string>('');
  readonly estimate = signal<number | null>(null);

  private load = effect(() => {
    const currentId = this.id();
    if (!currentId) return;
    this.api.get(currentId).subscribe(c => {
      this.claim.set(c);
      this.status.set(c.status);
      this.assignee.set(c.assignee ?? '');
 
    });
  });

  // Status pill
  statusClass = (s: ClaimStatus) =>
    ({
      NEW:       'bg-sky-100 text-sm py-0.2 pr-4  text-sky-700 ring-1 ring-sky-200',
      IN_REVIEW: 'bg-amber-100 text-sm py-0.2 pr-4 text-amber-700 ring-1 ring-amber-200',
      APPROVED:  'bg-emerald-100 text-sm py-0.2 pr-4  text-emerald-700 ring-1 ring-emerald-200',
      DENIED:    'bg-rose-100 text-sm py-0.2 pr-4 text-rose-700 ring-1 ring-rose-200',
      CLOSED:    'bg-slate-200 text-sm py-0.2 pr-4 text-slate-700 ring-1 ring-slate-300',
    } as const)[s] ?? 'bg-gray-200 text-sm py-0.2 pr-4 text-gray-700 ring-1 ring-gray-300';

  // Progress helpers
  stepDone(step: StepKey): boolean {
    const s = this.claim()?.status;
    if (!s) return false;
    if (step === 'FILED') return true;
    if (step === 'REVIEW') return s === 'IN_REVIEW' || s === 'APPROVED' || s === 'DENIED' || s === 'CLOSED';
    return s === 'APPROVED' || s === 'DENIED' || s === 'CLOSED';
  }
  dot(done: boolean) { return done ? 'bg-blue-600' : 'bg-gray-300'; }

  // Generic update (blocked for Customer & Auditor)
  save(): void {
    if (this.roleSvc.role() === 'Customer' || this.roleSvc.role() === 'Auditor') return;

    const c = this.claim(); if (!c) return;
    const body: UpdateClaimDto = {};
    const s = this.status();   if (s) body.status = s;
    const a = this.assignee(); if (a) body.assignee = a;

    this.api.update(c.id, body).subscribe({
      next: next => {
        this.claim.set(next);
        this.status.set(next.status);
        this.assignee.set(next.assignee ?? '');
      },
      error: err => console.error('Update claim failed', err)
    });
  }

  
  onNoteInput(e: Event)     { this.adjusterNote.set((e.target as HTMLTextAreaElement).value ?? ''); }
  onEstimateInput(e: Event) { const v = (e.target as HTMLInputElement).value; this.estimate.set(v ? Number(v) : null); }

  // Adjuster: actions (these assume backend accepts extra fields; if not, they no-op safely)
  addNote() {
    const note = (this.adjusterNote() || '').trim();
    const c = this.claim(); if (!c || !note) return;
    const body: UpdateClaimDto = { /* backend contract idea */ } as any;
    (body as any).note = note;
    this.api.update(c.id, body).subscribe({
      next: next => { this.claim.set(next); this.adjusterNote.set(''); },
      error: err => console.error('Add note failed', err)
    });
  }

  saveEstimate() {
    const est = this.estimate();
    const c = this.claim(); if (!c || est == null || isNaN(est)) return;
    const body: UpdateClaimDto = { } as any;
    (body as any).estimate = est;
    this.api.update(c.id, body).subscribe({
      next: next => this.claim.set(next),
      error: err => console.error('Save estimate failed', err)
    });
  }

  startReview() {
    const c = this.claim(); if (!c) return;
    this.api.update(c.id, { status: 'IN_REVIEW' }).subscribe({
      next: next => { this.claim.set(next); this.status.set(next.status); },
      error: err => console.error('Start review failed', err)
    });
  }

  onStatusChange(e: Event) { this.status.set((e.target as HTMLSelectElement).value as ClaimStatus); }
  onAssigneeInput(e: Event) { this.assignee.set((e.target as HTMLInputElement).value ?? ''); }

  onDelete() {
    const c = this.claim(); if (!c) return;
    if (!confirm(`Delete claim #${c.id}?`)) return;
    this.api.delete(c.id).subscribe({
      next: () => this.router.navigate(['/claims']),
      error: err => alert('Delete failed (check role/server): ' + (err?.error?.message ?? err.statusText ?? err))
    });
  }
}



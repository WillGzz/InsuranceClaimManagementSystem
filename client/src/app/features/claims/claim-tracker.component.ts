import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, DecimalPipe, LowerCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Claim, ClaimService } from '../../services/claim.service';
import { RoleService } from '../../services/role.service';

type StepKey = 'FILED'|'REVIEW'|'DECISION';

@Component({
  standalone: true,
  selector: 'claim-tracker',
  imports: [RouterLink, NgFor, NgIf, DecimalPipe, LowerCasePipe],  
  template: `
  <section class="layout">
    <aside class="left">
      <div class="search">
        <input placeholder="Search claims..." [value]="q()" (input)="onSearch($event)" />
      </div>
      <ul class="list">
        <li *ngFor="let c of filtered()" (click)="open(c)" [class.active]="c.id===selectedId()">
          <div class="id">CLM-{{ c.id }}</div>
          <div class="name">
            {{ c.policyNumber }}
            <span class="badge" [class.approved]="c.status==='APPROVED'"
                                 [class.denied]="c.status==='DENIED'"
                                 [class.review]="c.status==='IN_REVIEW'"
                                 [class.filed]="c.status==='NEW'"
                                 [class.closed]="c.status==='CLOSED'">
              {{ c.status }}
            </span>
          </div>
          <div class="amt">\${{ c.amount | number:'1.0-0' }}</div>
        </li>
      </ul>
    </aside>

    <main class="right" *ngIf="current() as cur">
      <header class="head">
        <h3>Claim CLM-{{ cur.id }}</h3>
        <div class="chip {{cur.status | lowercase}}">{{ cur.status }}</div>
      </header>

      <div class="summary">
        <div><small>Claim Amount</small><div class="big">\${{ cur.amount | number:'1.0-0' }}</div></div>
        <div><small>Date Filed</small><div class="big">{{ cur.reportedDate }}</div></div>
        <div><small>Policy</small><div class="big">{{ cur.policyNumber }}</div></div>
      </div>

      <section class="progress">
        <h4>Claim Progress</h4>
        <ul class="steps">
          <li [class.done]="stepDone('FILED')">
            <div class="dot"></div><div class="label">Filed</div><div class="date">{{ cur.reportedDate }}</div>
          </li>
          <li [class.done]="stepDone('REVIEW')">
            <div class="dot"></div><div class="label">Under Review</div><div class="date">{{ cur.updatedAt || '—' }}</div>
          </li>
          <li [class.done]="stepDone('DECISION')">
            <div class="dot"></div><div class="label">Decision</div><div class="date">{{ cur.updatedAt || '—' }}</div>
          </li>
        </ul>
      </section>

      <footer class="actions">
        <a [routerLink]="['/claims','list']">Back to List</a>
        <button *ngIf="roleSvc.role()==='Manager'" (click)="delete(cur)">Delete</button>
      </footer>
    </main>

    <main class="right" *ngIf="!current()">
      <p class="muted">Select a claim on the left to view progress.</p>
    </main>
  </section>
  `,
  styles: []
})
export class ClaimTrackerComponent {
  private svc = inject(ClaimService);
  readonly roleSvc = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private all = signal<Claim[]>([]);
  q = signal('');
  selectedId = signal<number | null>(null);

  constructor() {
    this.svc.list().subscribe(raw => {
      const data = raw ?? [];
      this.all.set(data);

      const idParam = this.route.snapshot.paramMap.get('id');
      const fallback = data[0]?.id ?? null;
      this.selectedId.set(idParam ? +idParam : fallback);
    });
  }

  filtered = computed(() => {
    const term = this.q().trim().toLowerCase();
    const list = this.all();
    if (!term) return list;
    return list.filter(c =>
      `${c.id}`.includes(term) ||
      c.policyNumber?.toLowerCase().includes(term) ||
      c.status?.toLowerCase().includes(term) ||
      c.assignee?.toLowerCase().includes(term)
    );
  });

  current = computed(() => this.all().find(c => c.id === this.selectedId()) || null);

  onSearch(e: Event) {
    const v = (e.target as HTMLInputElement)?.value ?? '';
    this.q.set(v);
  }

  open(c: Claim) {
    this.selectedId.set(c.id);
    this.router.navigate(['/claims', c.id]);
  }

  stepDone(step: StepKey): boolean {
    const s = this.current()?.status;
    if (!s) return false;
    if (step === 'FILED') return true;
    if (step === 'REVIEW') return s === 'IN_REVIEW' || s === 'APPROVED' || s === 'DENIED' || s === 'CLOSED';
    return s === 'APPROVED' || s === 'DENIED' || s === 'CLOSED';
  }

  delete(cur: Claim) {
    if (!confirm(`Delete claim #${cur.id}?`)) return;
    this.svc.delete(cur.id).subscribe({
      next: () => {
        const rest = this.all().filter(x => x.id !== cur.id);
        this.all.set(rest);
        this.selectedId.set(rest[0]?.id ?? null);
        if (!rest.length) this.router.navigate(['/claims','list']);
      },
      error: err => alert('Delete failed (check role & server): ' + (err?.error?.message ?? err.statusText ?? err))
    });
  }
}


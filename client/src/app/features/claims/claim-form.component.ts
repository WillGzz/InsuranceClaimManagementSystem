import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClaimService, ClaimType } from '../../services/claim.service';
import { RouterLink, Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { effect } from '@angular/core'

@Component({
  selector: 'app-claim-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
 
    <h2 class="text-xl font-semibold mb-4">New Claim</h2>
    <form class="grid grid-cols-2 gap-4" [formGroup]="form" (ngSubmit)="submit()">

      <div class="col-span-2">
        <label class="block text-sm text-gray-700 mb-1">Select Policy</label>
        <select class="w-full border rounded px-3 py-2" (change)="onPolicySelect($event)">
          <option value="">-- Choose an existing policy --</option>
          <option value="PC-8842">PC-8842 — (ACTIVE)</option>
          <option value="PC-1121">PC-1121 — (ACTIVE)</option>
          <option value="PC-5510">PC-5510 — (EXPIRED)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Policy Number</label>
        <input class="w-full border rounded px-3 py-2" formControlName="policyNumber">
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Loss Date</label>
        <input type="date" class="w-full border rounded px-3 py-2" formControlName="lossDate">
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Type</label>
        <select class="w-full border rounded px-3 py-2" formControlName="type">
          @for (t of types; track t) { <option [value]="t">{{ t }}</option> }
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Amount (USD)</label>
        <input type="number" class="w-full border rounded px-3 py-2" formControlName="amount">
      </div>

      <div class="col-span-2">
        <label class="block text-sm text-gray-700 mb-1">Description</label>
        <textarea rows="3" class="w-full border rounded px-3 py-2" formControlName="description"></textarea>
      </div>

      <div class="col-span-2 flex justify-end gap-2">
        <a routerLink="/claims" class="px-3 py-2 rounded border">Cancel</a>
        <button class="px-3 py-2 rounded bg-blue-600 text-white cursor-pointer" type="submit" [disabled]="form.invalid">
          Submit
        </button>
      </div>
    </form>
 
  `
})
export class ClaimFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(ClaimService);
  private router = inject(Router);
  readonly roleSvc = inject(RoleService);

  readonly types: ClaimType[] = ['ACCIDENT','THEFT','INJURY','FIRE','OTHER'];


  private _roleBounceNew = effect(() => {
  const role = this.roleSvc.role();     
  if (role === 'Adjuster' || role === 'Auditor') {
    this.router.navigateByUrl('/claims', { replaceUrl: true });
  }
});


  readonly form = this.fb.group({
    policyNumber: ['', [Validators.required]],
    lossDate: ['', [Validators.required]],
    type: ['ACCIDENT' as ClaimType, [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  onPolicySelect(e: Event) {
    const policyNumber = (e.target as HTMLSelectElement).value || '';
    if (policyNumber) this.form.patchValue({ policyNumber });
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;

    const payload = {
      policyNumber: v.policyNumber!,          // string
      lossDate: v.lossDate as string,         // 'YYYY-MM-DD'
      type: v.type!,                          // e.g. 'ACCIDENT'
      description: v.description ?? '',
      amount: Number(v.amount)
    };

    this.api.create(payload).subscribe({
      next: c => this.router.navigate(['/claims', c.id]),
      error: err => console.error('Create claim failed', err)
    });
  }
}

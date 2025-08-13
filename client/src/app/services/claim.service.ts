import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ClaimStatus = 'NEW'|'IN_REVIEW'|'APPROVED'|'DENIED'|'CLOSED';
export type ClaimType = 'ACCIDENT'|'THEFT'|'INJURY'|'FIRE'|'OTHER';

export interface Claim {
  id: number;
  policyNumber: string;
  lossDate: string;
  reportedDate: string;
  type: ClaimType;
  status: ClaimStatus;
  amount: number;
  assignee?: string;
  riskScore?: number;
  slaDueAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClaimDto {
  policyNumber: string;
  lossDate: string;
  type: ClaimType;
  description?: string;
  amount: number;
}
export interface UpdateClaimDto {
  status?: ClaimStatus;
  assignee?: string;
  amount?: number;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/claims';

  list(): Observable<Claim[]> { return this.http.get<Claim[]>(this.base); }
  get(id: number): Observable<Claim> { return this.http.get<Claim>(`${this.base}/${id}`); }
  create(body: CreateClaimDto): Observable<Claim> { return this.http.post<Claim>(this.base, body); }
  update(id: number, body: UpdateClaimDto): Observable<Claim> { return this.http.put<Claim>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

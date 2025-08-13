package com.insurance.claims.service;

import com.insurance.claims.dto.*;
import com.insurance.claims.entity.*;
import com.insurance.claims.repository.ClaimRepository;
import com.insurance.claims.repository.PolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.insurance.claims.dto.DtoMapper.*;

@Service
@Transactional
public class ClaimService {

    private final ClaimRepository claimRepo;
    private final PolicyRepository policyRepo;

    public ClaimService(ClaimRepository claimRepo, PolicyRepository policyRepo) {
        this.claimRepo = claimRepo;
        this.policyRepo = policyRepo;
    }


    public ClaimResponseDto createClaim(CreateClaimDto req, String role) {
        // Customers (and staff) can file
        LocalDate today = LocalDate.now();
        Policy policy = policyRepo.findActivePolicy(req.getPolicyNumber(), today)
                .orElseThrow(() -> new IllegalArgumentException("Policy not active or invalid for today"));

        validateCreate(req, policy);

        int risk = computeRiskScore(req, policy);
        LocalDateTime sla = computeSlaDueAt(LocalDateTime.now(), 48);
        Claim claim = fromCreate(req, policy, risk, sla);

        // (Optional) simple auto-assignment
        claim.setAssignee("ajuster1@example.com");

        claim = claimRepo.save(claim);
        return toDto(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponseDto> listClaims() {
        return claimRepo.findAll().stream().map(DtoMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ClaimResponseDto getClaim(Long id) {
        Claim claim = claimRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found"));
        return toDto(claim);
    }

    public ClaimResponseDto updateClaim(Long id, UpdateClaimDto req, String role) {
        Claim claim = claimRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found"));

        // Roles 
        // Adjuster can edit their assigned claims; Manager can edit all; Customers
        // cannot edit after create; Auditors read-only.
        if ("Customer".equalsIgnoreCase(role)) {
            throw new SecurityException("Customers cannot update existing claims");
        }
        if ("Auditor".equalsIgnoreCase(role)) {
            throw new SecurityException("Auditors are read-only");
        }
        if ("Adjuster".equalsIgnoreCase(role)) {
            if (claim.getAssignee() == null || !claim.getAssignee().equalsIgnoreCase("ajuster1@example.com")) {
                throw new SecurityException("Adjuster can only update assigned claims");
            }
        }
        // Manager can proceed; Adjuster allowed past the check above.

        // ===== Allowed updates =====
        if (req.getAmount() != null) {
            requirePositive(req.getAmount(), "Amount must be positive");
            claim.setAmount(req.getAmount());
            // Recompute risk if amount changed
            int newRisk = computeRiskScoreFromEntity(claim);
            claim.setRiskScore(newRisk);
        }
        if (req.getDescription() != null) {
            claim.setDescription(req.getDescription());
        }
        if (req.getAssignee() != null) {
            // Manager-only in a real app; we’ll allow here if not Customer/Auditor
            claim.setAssignee(req.getAssignee());
        }
        if (req.getStatus() != null) {
            claim.setStatus(ClaimStatus.valueOf(req.getStatus().toUpperCase()));
        }

        return toDto(claimRepo.save(claim));
    }

    // ===== Helpers =====

    private void validateCreate(CreateClaimDto req, Policy policy) {
        requirePositive(req.getAmount(), "Amount must be positive");
        if (req.getLossDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Loss date cannot be in the future");
        }
        // within effective window already checked by findActivePolicy()
        if (req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be > 0");
        }
        // Type validation comes from enum mapping in mapper
    }

    private int computeRiskScore(CreateClaimDto req, Policy policy) {

        int score = 0;
        // If the claim amount is more than 30% of the policy’s coverage limit, add 40 points.
        if (policy.getLimit() != null && req.getAmount() != null) {
            BigDecimal thirtyPct = policy.getLimit().multiply(new BigDecimal("0.30"));
            if (req.getAmount().compareTo(thirtyPct) > 0)
                score += 40;
        }
        // If the claim is filed within 14 days of the policy start date, add 20 points.
        long daysSinceStart = ChronoUnit.DAYS.between(policy.getEffectiveFrom(), LocalDate.now());
        if (daysSinceStart <= 14)
            score += 20;
            
        // Certain types considered higher risk
        if (req.getType() != null) {
            String t = req.getType().toUpperCase();
            if ("THEFT".equals(t) || "INJURY".equals(t) || "FIRE".equals(t))
                score += 15;
        }
        // Prior claims last 12 months
        long prev = claimRepo.countByPolicyAndReportedDateAfter(policy, LocalDate.now().minusMonths(12));
        if (prev > 2)
            score += 10;

        return Math.min(score, 100);
    }

    private int computeRiskScoreFromEntity(Claim claim) {
        CreateClaimDto tmp = new CreateClaimDto();
        tmp.setPolicyNumber(claim.getPolicy().getPolicyNumber());
        tmp.setLossDate(claim.getLossDate());
        tmp.setAmount(claim.getAmount());
        tmp.setType(claim.getType().name());
        return computeRiskScore(tmp, claim.getPolicy());
    }

    private LocalDateTime computeSlaDueAt(LocalDateTime from, int hours) {
        return from.plusHours(hours);
    }

    private void requirePositive(BigDecimal value, String msg) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(msg);
        }
    }
   
    public void deleteClaim(Long id) {
    if (!claimRepo.existsById(id)) {
        throw new Error("ID does not exist");
    }
    claimRepo.deleteById(id);
}


}

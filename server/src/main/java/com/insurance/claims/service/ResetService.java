package com.insurance.claims.service;

import com.insurance.claims.entity.*;
import com.insurance.claims.repository.ClaimRepository;
import com.insurance.claims.repository.PolicyRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class ResetService {

    private final ClaimRepository claimRepo;
    private final PolicyRepository policyRepo;

    @PersistenceContext
    private EntityManager em;

    public ResetService(ClaimRepository claimRepo, PolicyRepository policyRepo) {
        this.claimRepo = claimRepo;
        this.policyRepo = policyRepo;
    }

    @Transactional
    public void reset() {

        claimRepo.deleteAll();
        em.createNativeQuery("ALTER TABLE claims ALTER COLUMN id RESTART WITH 1").executeUpdate();

        // Get existing policies by number
        Policy p1 = policyRepo.findByPolicyNumber("PC-8842")
                .orElseThrow(() -> new IllegalStateException("Policy PC-8842 not found"));
        Policy p2 = policyRepo.findByPolicyNumber("PC-1121")
                .orElseThrow(() -> new IllegalStateException("Policy PC-1121 not found"));
        Policy p3 = policyRepo.findByPolicyNumber("PC-5510")
                .orElseThrow(() -> new IllegalStateException("Policy PC-5510 not found"));

        
        claimRepo.save(new Claim(
                null, p1,
                LocalDate.parse("2025-08-01"),
                LocalDate.parse("2025-08-02"),
                ClaimType.ACCIDENT,
                "Minor fender bender, rear bumper damage.",
                new BigDecimal("2450.00"),
                ClaimStatus.IN_REVIEW,
                "adjuster1@example.com",
                50
        ));

        claimRepo.save(new Claim(
                null, p2,
                LocalDate.parse("2025-07-28"),
                LocalDate.parse("2025-07-28"),
                ClaimType.FIRE,
                "Kitchen fire caused smoke damage.",
                new BigDecimal("18900.00"),
                ClaimStatus.NEW,
                "adjuster2@example.com",
                80
        ));

        claimRepo.save(new Claim(
                null, p3,
                LocalDate.parse("2025-07-20"),
                LocalDate.parse("2025-07-21"),
                ClaimType.THEFT,
                "Office break-in, stolen laptops.",
                new BigDecimal("600.00"),
                ClaimStatus.CLOSED,
                "adjuster3@example.com",
                10
        ));
    }
}
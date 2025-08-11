package com.insurance.claims.repository;

import com.insurance.claims.entity.Policy;
import com.insurance.claims.entity.PolicyStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByPolicyNumber(String policyNumber);

    default Optional<Policy> findActivePolicy(String policyNumber, LocalDate onDate) {
        return findByPolicyNumber(policyNumber)
                .filter(p -> p.getStatus() == PolicyStatus.ACTIVE
                          && !onDate.isBefore(p.getEffectiveFrom())
                          && !onDate.isAfter(p.getEffectiveTo()));
    }
}


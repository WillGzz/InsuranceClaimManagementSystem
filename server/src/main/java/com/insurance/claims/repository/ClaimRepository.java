package com.insurance.claims.repository;


import com.insurance.claims.entity.Claim;
import com.insurance.claims.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;



public interface ClaimRepository extends JpaRepository<Claim, Long> {
    long countByPolicy_Id(Long policyId);
    
    long countByPolicyAndReportedDateAfter(Policy policy, LocalDate after);
    
    List<Claim> findByStatusOrderByCreatedAtDesc(com.insurance.claims.entity.ClaimStatus status);
}

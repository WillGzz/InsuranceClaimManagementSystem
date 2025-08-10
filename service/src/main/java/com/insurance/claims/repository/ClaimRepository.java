package main.java.com.insurance.claims.repository;

import com.insurance.claims.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    long countByPolicy_Id(Long policyId);
}

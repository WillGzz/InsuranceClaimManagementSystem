package com.insurance.claims.dto;

import com.insurance.claims.entity.*;
import java.time.LocalDateTime;

public class DtoMapper {

    public static ClaimResponseDto toDto(Claim c) {
        ClaimResponseDto dto = new ClaimResponseDto();
        dto.setId(c.getId());
        dto.setPolicyNumber(c.getPolicy().getPolicyNumber());
        dto.setLossDate(c.getLossDate());
        dto.setReportedDate(c.getReportedDate());
        dto.setType(c.getType().name());
        dto.setStatus(c.getStatus().name());
        dto.setAmount(c.getAmount());
        dto.setAssignee(c.getAssignee());
        dto.setRiskScore(c.getRiskScore());
        dto.setSlaDueAt(c.getSlaDueAt());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    public static PolicyDto toDto(Policy p) {
        PolicyDto dto = new PolicyDto();
        dto.setPolicyNumber(p.getPolicyNumber());
        dto.setHolderName(p.getHolderName());
        dto.setStatus(p.getStatus().name());
        dto.setEffectiveFrom(p.getEffectiveFrom());
        dto.setEffectiveTo(p.getEffectiveTo());
        dto.setDeductible(p.getDeductible());
        dto.setLimit(p.getLimit());
        return dto;
    }

    public static Claim fromCreate(CreateClaimDto req, Policy policy, int riskScore, LocalDateTime slaDueAt) {
        Claim c = new Claim();
        c.setPolicy(policy);
        c.setLossDate(req.getLossDate());
        c.setReportedDate(java.time.LocalDate.now());
        c.setType(ClaimType.valueOf(req.getType().toUpperCase()));
        c.setDescription(req.getDescription());
        c.setAmount(req.getAmount());
        c.setStatus(ClaimStatus.NEW);
        c.setRiskScore(riskScore);
        c.setSlaDueAt(slaDueAt);
        return c;
    }
}


package com.insurance.claims.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class PolicyDto {
    private String policyNumber;
    private String holderName;
    private String status;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private BigDecimal deductible;
    private BigDecimal limit;
    
    public String getPolicyNumber() {
        return policyNumber;
    }
    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }
    public String getHolderName() {
        return holderName;
    }
    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDate getEffectiveFrom() {
        return effectiveFrom;
    }
    public void setEffectiveFrom(LocalDate effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }
    public LocalDate getEffectiveTo() {
        return effectiveTo;
    }
    public void setEffectiveTo(LocalDate effectiveTo) {
        this.effectiveTo = effectiveTo;
    }
    public BigDecimal getDeductible() {
        return deductible;
    }
    public void setDeductible(BigDecimal deductible) {
        this.deductible = deductible;
    }
    public BigDecimal getLimit() {
        return limit;
    }
    public void setLimit(BigDecimal limit) {
        this.limit = limit;
    }
    @Override
    public String toString() {
        return "PolicyDto [policyNumber=" + policyNumber + ", holderName=" + holderName + ", status=" + status
                + ", effectiveFrom=" + effectiveFrom + ", effectiveTo=" + effectiveTo + ", deductible=" + deductible
                + ", limit=" + limit + "]";
    }

    
    
}


package com.insurance.claims.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ClaimResponseDto {
    private Long id;
    private String policyNumber;
    private LocalDate lossDate;
    private LocalDate reportedDate;
    private String type;
    private String status;
    private BigDecimal amount;
    private String assignee;
    private Integer riskScore;
    private LocalDateTime slaDueAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getPolicyNumber() {
        return policyNumber;
    }
    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }
    public LocalDate getLossDate() {
        return lossDate;
    }
    public void setLossDate(LocalDate lossDate) {
        this.lossDate = lossDate;
    }
    public LocalDate getReportedDate() {
        return reportedDate;
    }
    public void setReportedDate(LocalDate reportedDate) {
        this.reportedDate = reportedDate;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    public String getAssignee() {
        return assignee;
    }
    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }
    public Integer getRiskScore() {
        return riskScore;
    }
    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }
    public LocalDateTime getSlaDueAt() {
        return slaDueAt;
    }
    public void setSlaDueAt(LocalDateTime slaDueAt) {
        this.slaDueAt = slaDueAt;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    @Override
    public String toString() {
        return "ClaimResponseDto [id=" + id + ", policyNumber=" + policyNumber + ", lossDate=" + lossDate
                + ", reportedDate=" + reportedDate + ", type=" + type + ", status=" + status + ", amount=" + amount
                + ", assignee=" + assignee + ", riskScore=" + riskScore + ", slaDueAt=" + slaDueAt + ", createdAt="
                + createdAt + ", updatedAt=" + updatedAt + "]";
    }

    

}


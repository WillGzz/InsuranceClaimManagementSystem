package com.insurance.claims.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.LAZY)  //fetching policy on when needed
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @NotNull
    @PastOrPresent  //only allow for current and present date
    private LocalDate lossDate;

    @NotNull
    @PastOrPresent
    private LocalDate reportedDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ClaimType type;

    @Size(max = 4000)
    private String description;

    @NotNull
    @Positive
    @Column(precision = 14, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ClaimStatus status = ClaimStatus.NEW;

    @Size(max = 120)
    private String assignee; //person assigned to review, process, and close the claim.

    @Min(0)
    @Max(100)
    private Integer riskScore = 0; // potential risk of a claim being fraudulent, high-cost, or complicated. Cost here increments financial risk for insurer
   
    private LocalDateTime slaDueAt; //  time commitment the insurer makes to respond to or resolve a claim. 48h

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Policy getPolicy() {
        return policy;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
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

    public ClaimType getType() {
        return type;
    }

    public void setType(ClaimType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
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
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Claim))
            return false;
        Claim other = (Claim) o;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() {

        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Claim [id=" + id + ", policy=" + policy + ", lossDate=" + lossDate + ", reportedDate=" + reportedDate
                + ", type=" + type + ", description=" + description + ", amount=" + amount + ", status=" + status
                + ", assignee=" + assignee + ", riskScore=" + riskScore + ", slaDueAt=" + slaDueAt + ", createdAt="
                + createdAt + ", updatedAt=" + updatedAt + "]";
    }

    
}



package com.insurance.claims.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class UpdateClaimDto {
    // allow only fields a user may change via UI

    private String status;   // NEW/IN_REVIEW/APPROVED/DENIED/CLOSED (server validates)

    private String assignee; // adjuster id/email (server validates)
    
    @Positive
    private BigDecimal amount; // optional correction

    @Size(max = 4000)
    private String description;

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getAssignee() {
        return assignee;
    }
    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }
    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    @Override
    public String toString() {
        return "UpdateClaimDto [status=" + status + ", assignee=" + assignee + ", amount=" + amount + ", description="
                + description + "]";
    }

    
}


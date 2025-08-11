package com.insurance.claims.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateClaimDto {
    
    @NotBlank
    private String policyNumber;
    
    @NotNull @PastOrPresent
    private LocalDate lossDate;
    
    @NotNull @Positive
    private BigDecimal amount;
    
    @NotBlank
    private String type; // ACCIDENT, THEFT, INJURY, FIRE, OTHER
    
    @Size(max = 4000)
    private String description;
    
    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }
    
    public void setLossDate(LocalDate lossDate) {
        this.lossDate = lossDate;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public LocalDate getLossDate() {
        return lossDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return "CreateClaimDto [policyNumber=" + policyNumber + ", lossDate=" + lossDate + ", amount=" + amount
                + ", type=" + type + ", description=" + description + "]";
    }
    
}

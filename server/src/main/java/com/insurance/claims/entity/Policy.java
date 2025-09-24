package com.insurance.claims.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "policy_number", unique = true, nullable = false, length = 30)
    private String policyNumber;

    @NotBlank
    @Column(name = "holder_name", nullable = false)
    private String holderName;

    @NotNull
    private LocalDate effectiveFrom;

    @NotNull
    private LocalDate effectiveTo;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PolicyStatus status = PolicyStatus.ACTIVE;

    @NotNull
    @PositiveOrZero
    @Column(precision = 14, scale = 2)
    private BigDecimal deductible; // out-of-pocket before insurer pays

    @NotNull
    @Positive
    @Column(name = "coverage_limit", precision = 14, scale = 2)
    private BigDecimal limit; // max insurer payout

    public Policy(Long id, String policyNumber, String holderName, LocalDate effectiveFrom, LocalDate effectiveTo,
            PolicyStatus status, BigDecimal deductible, BigDecimal limit) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.holderName = holderName;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
        this.status = status;
        this.deductible = deductible;
        this.limit = limit;
    }

    public Policy() {}

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

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {

        this.holderName = holderName;

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

    public PolicyStatus getStatus() {
        return status;
    }

    public void setStatus(PolicyStatus status) {
        this.status = status;
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
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Policy))
            return false;
        Policy other = (Policy) o;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() { // If two objects are equal according to equals(), they must also return the
                            // same hashCode().
        // Uses only 'id' because in JPA, equality is based on primary key
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Policy [id=" + id + ", policyNumber=" + policyNumber + ", holderName=" + holderName + ", effectiveFrom="
                + effectiveFrom + ", effectiveTo=" + effectiveTo + ", status=" + status + ", deductible=" + deductible
                + ", limit=" + limit + "]";
    }

}
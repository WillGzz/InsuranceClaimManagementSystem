DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS policies;

CREATE TABLE policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(64) NOT NULL UNIQUE,
    holder_name VARCHAR(255) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    deductible DECIMAL(14,2) NOT NULL,
    coverage_limit DECIMAL(14,2) NOT NULL
);

CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_id BIGINT NOT NULL,
    loss_date DATE NOT NULL,
    reported_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL,
    description VARCHAR(4000),
    amount DECIMAL(14,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    assignee VARCHAR(120),
    risk_score INT,
    sla_due_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_policy FOREIGN KEY (policy_id) REFERENCES policies(id)
);


INSERT INTO policies (id, policy_number, holder_name, effective_from, effective_to, status, deductible, coverage_limit)
VALUES 
(1, 'PC-8842', 'John Doe', '2025-01-01', '2025-12-31', 'ACTIVE', 500.00, 20000.00),
(2, 'PC-1121', 'Jane Smith', '2025-03-01', '2026-03-01', 'ACTIVE', 1000.00, 50000.00),
(3, 'PC-5510', 'Acme Corp', '2024-07-01', '2025-07-01', 'EXPIRED', 2000.00, 100000.00);

INSERT INTO claims (id, policy_id, loss_date, reported_date, type, description, amount, status, assignee, risk_score, sla_due_at, created_at, updated_at)
VALUES
(101, 1, '2025-08-01', '2025-08-02', 'ACCIDENT', 'Minor fender bender, rear bumper damage.', 2450.00, 'IN_REVIEW', 'adjuster1', 50, '2025-08-04T12:00:00', '2025-08-02T09:30:00', '2025-08-02T09:30:00'),
(102, 2, '2025-07-28', '2025-07-28', 'FIRE', 'Kitchen fire caused smoke damage.', 18900.00, 'NEW', NULL, 80, '2025-07-30T14:00:00', '2025-07-28T08:45:00', '2025-07-28T08:45:00'),
(103, 3, '2025-07-20', '2025-07-21', 'THEFT', 'Office break-in, stolen laptops.', 600.00, 'CLOSED', 'adjuster2', 10, NULL, '2025-07-21T10:15:00', '2025-07-21T10:15:00');

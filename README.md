
# Project: Insurance Claim Management App (Spring Boot + Angular)

## Background
This is a full stack app that focuses on  managing insurance policies and claims. The backend is a Spring Boot REST API that handles 
business rules (coverage checks by loss date, risk scoring, SLA timestamps) and role-based authorization. The frontend in Angular lets users list/filter/search claims, create new claims, view claim progress, and—if they’re Managers delete claims.

---

## Features

- **Claim Management**
  - Create, view, search, and filter claims 
  - Update status and assignee (role-based).
  - Manager-only delete 
  - “Filed → Review → Decision” progress UI.

- **Policy Coverage Check**
  - Validates that a policy covered the **loss date** (occurrence-based model).  


- **Risk Scoring & SLA**
  - Risk score from amount vs. policy limit, timing, and prior claims.
  - SLA due time recorded on create.

- **Role-Based Behavior**
  - `X-Role` header determines allowed actions on the server.
  - UI hides disallowed actions; **server still enforces** rules.

- **Data Persistence**
  - Spring Data JPA/Hibernate entities for `Policy` and `Claim`.
  - Seed data on starup

---

## Architecture

**Backend (3-layer):**
- **Controller** (`@RestController`): HTTP endpoints, status codes, content negotiation.
- **Service** (`@Service`): business logic (coverage checks, role rules, risk/SLA).
- **Repository** (`JpaRepository`): persistence for `Claim` and `Policy`.

**Frontend (Angular):**
- Standalone components: `ClaimsListComponent`, `ClaimFormComponent`, `ClaimDetailComponent`, `ClaimTrackerComponent`.
- Routing with lazy-loaded feature routes.
- Signals for state 
---

## Technologies Used

**Languages**
- Java
- TypeScript / HTML / CSS
- SQL

**Frameworks & Libraries**
- Spring Boot, Spring Web (MVC), Spring Data JPA, Hibernate
- Jackson (JSON)
- Angular (standalone components & signals)
- Tailwind CSS 

**Database**
- H2 

**Testing & Development**
- Spring Boot Test, JUnit, Maven
- Angular CLI
- Postman (Apis)

---
## Getting Started

### Backend (Spring Boot)

~~~bash
mvn spring-boot:run
~~~

### Frontend (Angular)

~~~bash
npm install
npm start   # runs: ng serve --proxy-config proxy.conf.json
~~~




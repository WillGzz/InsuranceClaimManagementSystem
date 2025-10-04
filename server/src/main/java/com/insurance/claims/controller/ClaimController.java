package com.insurance.claims.controller;

import com.insurance.claims.dto.ClaimResponseDto;
import com.insurance.claims.dto.CreateClaimDto;
import com.insurance.claims.dto.UpdateClaimDto;
import com.insurance.claims.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService service;

    public ClaimController(ClaimService service) {
        this.service = service;
    }

    // MVP role helper (Customer/Adjuster/Manager/Auditor)
    private String roleOrDefault(String roleHeader) {
        return roleHeader == null ? "Customer" : roleHeader;
    }

    @PostMapping
    public ResponseEntity<ClaimResponseDto> create(
            @Valid @RequestBody CreateClaimDto req,
            @RequestHeader(value = "X-Role", required = false) String role) {

        if (role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 if no role header
        }
        ClaimResponseDto created = service.createClaim(req, roleOrDefault(role));
        URI location = URI.create("/api/claims/" + created.getId());
        return ResponseEntity.created(location).body(created); // 201 + Location + body
    }

    @GetMapping
    public ResponseEntity<List<ClaimResponseDto>> list() {
        List<ClaimResponseDto> claims = service.listClaims();
        return claims.isEmpty()
                ? ResponseEntity.noContent().build() // 204 if nothing to show
                : ResponseEntity.ok(claims);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getClaim(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClaimResponseDto> update(
            @PathVariable Long id,
            @RequestBody UpdateClaimDto req,
            @RequestHeader(value = "X-Role", required = false) String role) {
        if (role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401
        }
        ClaimResponseDto updated = service.updateClaim(id, req, roleOrDefault(role));
        return ResponseEntity.ok(updated); // 200 with body
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader(value = "X-Role", required = false) String role) {

        if (role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!"Manager".equals(roleOrDefault(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403
        }

        service.deleteClaim(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{id}.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getAsXml(@PathVariable Long id) {
        ClaimResponseDto c = service.getClaim(id);
        String xml = """
                <claim>
                  <id>%d</id>
                  <policyNumber>%s</policyNumber>
                  <lossDate>%s</lossDate>
                  <reportedDate>%s</reportedDate>
                  <type>%s</type>
                  <status>%s</status>
                  <amount>%s</amount>
                  <riskScore>%d</riskScore>
                </claim>
                """.formatted(
                c.getId(),
                safe(c.getPolicyNumber()),
                c.getLossDate(),
                c.getReportedDate(),
                safe(c.getType()),
                safe(c.getStatus()),
                c.getAmount(),
                c.getRiskScore() == null ? 0 : c.getRiskScore());
        return ResponseEntity.ok(xml);
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}

package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.policy.CreatePolicyRequest;
import bg.fmi.polyhub.dto.policy.PolicySummary;
import bg.fmi.polyhub.services.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping()
    @PreAuthorize("hasAnyRole('PARTY_ADMIN', 'POLYHUB_SPECIALIST')")
    public List<PolicySummary> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    @PostMapping()
    @PreAuthorize("hasRole('POLYHUB_SPECIALIST')")
    @ResponseStatus(HttpStatus.CREATED)
    public PolicySummary createPolicy(@Valid @RequestBody CreatePolicyRequest request) {
        return policyService.createNewPolicy(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('POLYHUB_SPECIALIST')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePolicy(@PathVariable Long id) {
        policyService.deletePolicyById(id);
    }
}

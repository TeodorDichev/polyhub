package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.dto.specialist.PartyForRatingResponse;
import bg.fmi.polyhub.dto.specialist.PartyRatingRequest;
import bg.fmi.polyhub.dto.specialist.CreatePolicyRequest;
import bg.fmi.polyhub.dto.policy.PolicySummary;
import bg.fmi.polyhub.dto.specialist.ProgramForRatingResponse;
import bg.fmi.polyhub.dto.specialist.ProgramRatingRequest;
import bg.fmi.polyhub.services.ElectionService;
import bg.fmi.polyhub.services.PartyService;
import bg.fmi.polyhub.services.PolicyService;
import bg.fmi.polyhub.services.ProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/specialist")
@RequiredArgsConstructor
@PreAuthorize("hasRole('POLYHUB_SPECIALIST')")
public class SpecialistController {

    private final ElectionService electionService;
    private final PolicyService policyService;
    private final PartyService partyService;
    private final ProgramService programService;

    @GetMapping("/elections")
    public List<ElectionResponse> getAllElections() {
        return electionService.getAll();
    }

    @PostMapping("/elections")
    @ResponseStatus(HttpStatus.CREATED)
    public ElectionResponse createElection(@Valid @RequestBody CreateElectionRequest request) {
        return electionService.create(request);
    }

    @PutMapping("/elections/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ElectionResponse updateElection(@PathVariable Long id, @Valid @RequestBody CreateElectionRequest request) {
        return electionService.update(id, request);
    }

    @DeleteMapping("/elections/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteElection(@PathVariable Long id) {
        electionService.delete(id);
    }

    @GetMapping("/policies")
    public List<PolicySummary> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    @PostMapping("/policies")
    public PolicySummary createPolicy(@Valid @RequestBody CreatePolicyRequest request) {
        return policyService.createNewPolicy(request);
    }

    @DeleteMapping("/policies/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePolicy(@PathVariable Long id) {
        policyService.deletePolicyById(id);
    }

    @GetMapping("/parties")
    public List<PartyForRatingResponse> getAllParties() {
        return partyService.getAllApprovedParties();
    }

    @PutMapping("/parties/{id}/rate")
    public PartyForRatingResponse rateParty(@PathVariable Long id, @Valid @RequestBody PartyRatingRequest request) {
        return partyService.rateParty(id, request);
    }

    @GetMapping("/programs")
    public List<ProgramForRatingResponse> getAllPrograms() {
        return programService.getAllPrograms();
    }

    @GetMapping("/programs/{id}")
    public ProgramForRatingResponse getProgram(@PathVariable Long id) {
        return programService.getProgram(id);
    }

    @PutMapping("/programs/{id}/rate")
    public ProgramForRatingResponse rateProgram(@PathVariable Long id, @Valid @RequestBody ProgramRatingRequest request) {
        return programService.rateProgram(id, request);
    }
}

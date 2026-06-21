package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.dto.program.CreateProgramRequest;
import bg.fmi.polyhub.dto.program.ProgramResponse;
import bg.fmi.polyhub.dto.program.ProgramSuggestion;
import bg.fmi.polyhub.services.PartyService;
import bg.fmi.polyhub.services.ProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/party-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PARTY_ADMIN')")
public class PartyAdminController {

    private final PartyService partyService;
    private final ProgramService programService;

    @PostMapping("/parties/submit")
    @ResponseStatus(HttpStatus.CREATED)
    public PartyResponse submit(@Valid @RequestBody SubmitPartyRequest request,
                                @AuthenticationPrincipal String email) { // AuthenticationPrincipal pulls the email from the token
        return partyService.submit(request, email);
    }

    @PutMapping("/parties/resubmit")
    @ResponseStatus(HttpStatus.OK)
    public PartyResponse resubmit(@Valid @RequestBody SubmitPartyRequest request,
                                  @AuthenticationPrincipal String email) {
        return partyService.resubmit(request, email);
    }

    @GetMapping("/parties/my")
    @ResponseStatus(HttpStatus.OK)
    public PartyResponse getMyParty(@AuthenticationPrincipal String email) {
        return partyService.getMyParty(email);
    }

    @GetMapping("/suggestion")
    @PreAuthorize("hasRole('PARTY_ADMIN')")
    public Optional<ProgramSuggestion> getSuggestion(@AuthenticationPrincipal String email) {
        return programService.getSuggestion(email);
    }

    @PutMapping("/programs/{electionId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('PARTY_ADMIN')")
    public ProgramResponse createOrUpdate(
            @PathVariable Long electionId,
            @Valid @RequestBody CreateProgramRequest request,
            @AuthenticationPrincipal String email) {
        return programService.createOrUpdate(electionId, request, email);
    }

    @GetMapping("/programs/{electionId}")
    @PreAuthorize("hasRole('PARTY_ADMIN')")
    public ProgramResponse getMyProgram(
            @PathVariable Long electionId,
            @AuthenticationPrincipal String email) {
        return programService.getMyProgram(electionId, email);
    }
}
package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.program.CreateProgramRequest;
import bg.fmi.polyhub.dto.program.ProgramResponse;
import bg.fmi.polyhub.dto.program.ProgramSuggestion;
import bg.fmi.polyhub.services.ProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @GetMapping("/suggestion")
    @PreAuthorize("hasRole('PARTY_ADMIN')")
    public Optional<ProgramSuggestion> getSuggestion(@AuthenticationPrincipal String email) {
        return programService.getSuggestion(email);
    }

    @PutMapping("/{electionId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('PARTY_ADMIN')")
    public ProgramResponse createOrUpdate(
            @PathVariable Long electionId,
            @Valid @RequestBody CreateProgramRequest request,
            @AuthenticationPrincipal String email) {
        return programService.createOrUpdate(electionId, request, email);
    }

    @GetMapping("/{electionId}")
    @PreAuthorize("hasRole('PARTY_ADMIN')")
    public ProgramResponse getMyProgram(
            @PathVariable Long electionId,
            @AuthenticationPrincipal String email) {
        return programService.getMyProgram(electionId, email);
    }
}
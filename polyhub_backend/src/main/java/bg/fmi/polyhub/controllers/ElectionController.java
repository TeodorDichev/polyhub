package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.services.ElectionService;
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
import bg.fmi.polyhub.dto.election.ElectionDetailsResponse;

import java.util.List;

@RestController
@RequestMapping("/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('POLYHUB_SPECIALIST')")
    public ElectionResponse create(@Valid @RequestBody CreateElectionRequest request) {
        return electionService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('POLYHUB_SPECIALIST')")
    public ElectionResponse update(@PathVariable Long id, @Valid @RequestBody CreateElectionRequest request) {
        return electionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('POLYHUB_SPECIALIST')")
    public void delete(@PathVariable Long id) {
        electionService.delete(id);
    }

    @GetMapping
    public List<ElectionResponse> getAll() {
        return electionService.getAll();
    }

    @GetMapping("/{id}")
    public ElectionDetailsResponse getById(@PathVariable Long id) {
        return electionService.getById(id);
    }
}
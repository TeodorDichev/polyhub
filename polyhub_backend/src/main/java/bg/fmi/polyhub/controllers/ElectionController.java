package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.services.ElectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.election.ElectionDetailsResponse;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.services.ElectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @GetMapping
    public List<ElectionResponse> getAll() {
        return electionService.getAll();
    }

    @GetMapping("/{id}")
    public ElectionDetailsResponse getById(@PathVariable Long id) {
        return electionService.getById(id);
    }
}

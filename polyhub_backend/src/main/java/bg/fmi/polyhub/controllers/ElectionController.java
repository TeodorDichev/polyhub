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
import bg.fmi.polyhub.dto.election.ElectionPageResponse;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @GetMapping
    public List<ElectionResponse> getAll() {
        return electionService.getAll();
    }

    @GetMapping("/page")
    public ElectionPageResponse getPage(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return electionService.getPublicElectionsPage(search, page, size);
    }

    @GetMapping("/{id}")
    public ElectionDetailsResponse getById(@PathVariable Long id) {
        return electionService.getById(id);
    }
}

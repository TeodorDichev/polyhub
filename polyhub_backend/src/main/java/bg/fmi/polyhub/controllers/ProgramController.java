package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.program.ProgramDetailsResponse;
import bg.fmi.polyhub.services.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/programs")
@RequiredArgsConstructor
public class ProgramController {

    private final ProgramService programService;

    @GetMapping("/details/{id}")
    public ProgramDetailsResponse getDetails(@PathVariable Long id) {
        return programService.getDetails(id);
    }
}
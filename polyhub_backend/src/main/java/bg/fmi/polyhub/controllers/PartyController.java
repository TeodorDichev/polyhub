package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.party.PartyDetailsResponse;
import bg.fmi.polyhub.services.PartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/parties")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;

    @GetMapping("/details/{id}")
    public PartyDetailsResponse getDetails(@PathVariable Long id) {
        return partyService.getDetails(id);
    }
}
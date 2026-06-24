package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.party.PartyDetailsResponse;
import bg.fmi.polyhub.services.PartyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import bg.fmi.polyhub.dto.party.PartyPageResponse;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/parties")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;

    @GetMapping
    public PartyPageResponse getParties(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return partyService.getPublicParties(search, page, size);
    }

    @GetMapping("/details/{id}")
    public PartyDetailsResponse getDetails(@PathVariable Long id) {
        return partyService.getDetails(id);
    }
}
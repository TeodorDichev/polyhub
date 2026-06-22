package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.services.PartyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import bg.fmi.polyhub.dto.party.PartyDetailsResponse;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/parties")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;

    @PostMapping("/submit")
    @ResponseStatus(HttpStatus.CREATED)
    public PartyResponse submit(@Valid @RequestBody SubmitPartyRequest request,
                                @AuthenticationPrincipal String email) { // AuthenticationPrincipal pulls the email from the token
        return partyService.submit(request, email);
    }

    @PutMapping("/resubmit")
    @ResponseStatus(HttpStatus.OK)
    public PartyResponse resubmit(@Valid @RequestBody SubmitPartyRequest request,
                                  @AuthenticationPrincipal String email) {
        return partyService.resubmit(request, email);
    }

    @GetMapping("/details/{id}")
    public PartyDetailsResponse getDetails(@PathVariable Long id) {
        return partyService.getDetails(id);
    }

    @GetMapping("/my")
    @ResponseStatus(HttpStatus.OK)
    public PartyResponse getMyParty(@AuthenticationPrincipal String email) {
        return partyService.getMyParty(email);
    }
}
package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.partyadmin.LoggedPartyAdmin;
import bg.fmi.polyhub.services.PartyAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/party-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PARTY_ADMIN')")
public class PartyAdminController {

    private final PartyAdminService partyAdminService;

    @GetMapping("/me")
    public LoggedPartyAdmin getMe(@AuthenticationPrincipal String email) {
        return partyAdminService.getMe(email);
    }
}
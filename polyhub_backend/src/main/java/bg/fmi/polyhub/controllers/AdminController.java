package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.admin.AdminPartyPageResponse;
import bg.fmi.polyhub.dto.admin.AdminUserPageResponse;
import bg.fmi.polyhub.dto.admin.PartyAdminResponse;
import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.dto.admin.CreateSpecialistRequest;
import bg.fmi.polyhub.dto.admin.RejectPartyRequest;
import bg.fmi.polyhub.services.PartyAdminService;
import bg.fmi.polyhub.services.PartyService;
import bg.fmi.polyhub.services.SpecialistService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

// after discussion, we decided to leave this controller role-based

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PartyAdminService partyAdminService;
    private final SpecialistService specialistService;
    private final PartyService partyService;

    @GetMapping("/party-admins")
    public AdminUserPageResponse getAllPartyAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return partyAdminService.getAllPartyAdminsPaged(page, size);
    }

    @GetMapping("/party-admins/{id}")
    public AdminUserResponse getPartyAdmin(@PathVariable Long id) {
        return partyAdminService.getPartyAdmin(id);
    }

    @PutMapping("/party-admins/{id}/suspend")
    public AdminUserResponse suspendPartyAdmin(@PathVariable Long id) {
        return partyAdminService.suspendPartyAdmin(id);
    }

    @PutMapping("/party-admins/{id}/unsuspend")
    public AdminUserResponse unsuspendPartyAdmin(@PathVariable Long id) {
        return partyAdminService.unsuspendPartyAdmin(id);
    }

    @DeleteMapping("/party-admins/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePartyAdmin(@PathVariable Long id) {
        partyAdminService.deletePartyAdmin(id);
    }

    @GetMapping("/specialists")
    public AdminUserPageResponse getAllSpecialists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return specialistService.getAllSpecialistsPaged(page, size);
    }

    @GetMapping("/specialists/{id}")
    public AdminUserResponse getSpecialist(@PathVariable Long id) {
        return specialistService.getSpecialist(id);
    }

    @PostMapping("/specialists")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUserResponse createSpecialist(@Valid @RequestBody CreateSpecialistRequest request) {
        return specialistService.createSpecialist(request);
    }

    @DeleteMapping("/specialists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSpecialist(@PathVariable Long id) {
        specialistService.deleteSpecialist(id);
    }

    @GetMapping("/parties")
    public AdminPartyPageResponse getAllParties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return partyService.getAllPartiesPaged(page, size);
    }

    @GetMapping("/parties/{id}")
    public PartyAdminResponse getParty(@PathVariable Long id) {
        return partyService.getParty(id);
    }

    @PutMapping("/parties/{id}/approve")
    public PartyAdminResponse approveParty(@PathVariable Long id) {
        return partyService.approveParty(id);
    }

    @PutMapping("/parties/{id}/reject")
    public PartyAdminResponse rejectParty(@PathVariable Long id,
                                          @RequestBody RejectPartyRequest request) {
        return partyService.rejectParty(id, request);
    }

    @DeleteMapping("/parties/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteParty(@PathVariable Long id) {
        partyService.deleteParty(id);
    }
}
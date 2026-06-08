package bg.fmi.polyhub.controllers;

import bg.fmi.polyhub.dto.admin.AdminPartyResponse;
import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.dto.admin.CreateSpecialistRequest;
import bg.fmi.polyhub.dto.admin.RejectPartyRequest;
import bg.fmi.polyhub.services.AdminPartyService;
import bg.fmi.polyhub.services.AdminService;
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

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminUserService;
    private final AdminPartyService adminPartyService;

    @GetMapping("/party-admins")
    public List<AdminUserResponse> getAllPartyAdmins() {
        return adminUserService.getAllPartyAdmins();
    }

    @GetMapping("/party-admins/{id}")
    public AdminUserResponse getPartyAdmin(@PathVariable Long id) {
        return adminUserService.getPartyAdmin(id);
    }

    @PutMapping("/party-admins/{id}/suspend")
    public AdminUserResponse suspendPartyAdmin(@PathVariable Long id) {
        return adminUserService.suspendPartyAdmin(id);
    }

    @PutMapping("/party-admins/{id}/unsuspend")
    public AdminUserResponse unsuspendPartyAdmin(@PathVariable Long id) {
        return adminUserService.unsuspendPartyAdmin(id);
    }

    @DeleteMapping("/party-admins/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePartyAdmin(@PathVariable Long id) {
        adminUserService.deletePartyAdmin(id);
    }

    @GetMapping("/specialists")
    public List<AdminUserResponse> getAllSpecialists() {
        return adminUserService.getAllSpecialists();
    }

    @GetMapping("/specialists/{id}")
    public AdminUserResponse getSpecialist(@PathVariable Long id) {
        return adminUserService.getSpecialist(id);
    }

    @PostMapping("/specialists")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUserResponse createSpecialist(@Valid @RequestBody CreateSpecialistRequest request) {
        return adminUserService.createSpecialist(request);
    }

    @DeleteMapping("/specialists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSpecialist(@PathVariable Long id) {
        adminUserService.deleteSpecialist(id);
    }

    @GetMapping("/parties")
    public List<AdminPartyResponse> getAllParties() {
        return adminPartyService.getAllParties();
    }

    @GetMapping("/parties/{id}")
    public AdminPartyResponse getParty(@PathVariable Long id) {
        return adminPartyService.getParty(id);
    }

    @PutMapping("/parties/{id}/approve")
    public AdminPartyResponse approveParty(@PathVariable Long id) {
        return adminPartyService.approveParty(id);
    }

    @PutMapping("/parties/{id}/reject")
    public AdminPartyResponse rejectParty(@PathVariable Long id,
                                          @RequestBody RejectPartyRequest request) {
        return adminPartyService.rejectParty(id, request);
    }

    @DeleteMapping("/parties/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteParty(@PathVariable Long id) {
        adminPartyService.deleteParty(id);
    }
}
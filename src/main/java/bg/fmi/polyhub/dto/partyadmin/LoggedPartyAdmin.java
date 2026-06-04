package bg.fmi.polyhub.dto.partyadmin;

import bg.fmi.polyhub.entities.RoleType;

public record LoggedPartyAdmin(
        Long id,
        String email,
        String firstname,
        String lastname,
        RoleType role
) {}

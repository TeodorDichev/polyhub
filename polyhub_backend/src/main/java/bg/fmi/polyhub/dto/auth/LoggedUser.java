package bg.fmi.polyhub.dto.auth;

import bg.fmi.polyhub.entities.RoleType;

public record LoggedUser(
        Long id,
        String email,
        String firstname,
        String lastname,
        RoleType role
) {}

package bg.fmi.polyhub.dto.admin;

import bg.fmi.polyhub.entities.RoleType;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String email,
        String firstname,
        String lastname,
        RoleType role,
        LocalDateTime createdAt,
        LocalDateTime deletedAt,
        LocalDateTime suspendedOn
) {}
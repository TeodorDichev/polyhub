package bg.fmi.polyhub.dto.party;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PartyResponse(
        Long id,
        String name,
        String description,
        String motto,
        String logoUrl,
        LocalDate foundedOn,
        String status,
        String rejectionComment,
        LocalDateTime createdAt,
        String createdByEmail
) {}
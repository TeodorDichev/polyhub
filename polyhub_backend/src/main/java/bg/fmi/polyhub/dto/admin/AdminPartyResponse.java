package bg.fmi.polyhub.dto.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminPartyResponse(
        Long id,
        String name,
        String description,
        String motto,
        String logoUrl,
        LocalDate foundedOn,
        String status,
        String rejectionComment,
        LocalDateTime createdAt,
        LocalDateTime deletedAt,
        String createdByEmail,
        Double selfEconomicAxis,
        Double selfSocialAxis,
        Double specEconomicAxis,
        Double specSocialAxis
) {}
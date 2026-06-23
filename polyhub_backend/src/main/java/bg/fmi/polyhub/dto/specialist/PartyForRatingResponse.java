package bg.fmi.polyhub.dto.specialist;

import lombok.Builder;

import java.time.LocalDate;

// I wanted to leave this a record, so claude recommended Builder annotation
// Apparently this creates a builder pattern for the class
// The problem was mapping in the service and records are immutable
@Builder(toBuilder = true)
public record PartyForRatingResponse(
        Long id,
        String name,
        String motto,
        String description,
        String logoUrl,
        LocalDate foundedOn,
        Double selfEconomicAxis,
        Double selfSocialAxis,
        Double specEconomicAxis,
        Double specSocialAxis,
        boolean rated,
        String politicalLabel
) {}
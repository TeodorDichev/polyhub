package bg.fmi.polyhub.dto.specialist;

import lombok.Builder;

import java.time.LocalDate;

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
        boolean rated
) {}
package bg.fmi.polyhub.dto.specialist;

import jakarta.validation.constraints.NotNull;

public record PartyRatingRequest(
        @NotNull(message = "Economic axis is required")
        Double specEconomicAxis,

        @NotNull(message = "Social axis is required")
        Double specSocialAxis
) {}
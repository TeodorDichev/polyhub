package bg.fmi.polyhub.dto.specialist;

import jakarta.validation.constraints.NotNull;

public record ProgramRatingRequest(
        @NotNull(message = "Economic axis is required")
        Double specEconomicAxis,

        @NotNull(message = "Social axis is required")
        Double specSocialAxis
) {}
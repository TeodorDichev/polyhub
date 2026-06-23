package bg.fmi.polyhub.dto.party;

import jakarta.validation.constraints.NotNull;

public record SelfRatePartyRequest(
        @NotNull(message = "Economic axis is required")
        Double selfEconomicAxis,

        @NotNull(message = "Social axis is required")
        Double selfSocialAxis
) {}

package bg.fmi.polyhub.dto.policy;

public record PolicySummary(
        Long id,
        String name,
        String slug,
        String politicalPosition,
        Double specEconomicAxis,
        Double specSocialAxis
) {}
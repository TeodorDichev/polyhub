package bg.fmi.polyhub.dto.program;

public record ProgramPolicyDetailsResponse(
        Long id,
        String name,
        String slug,
        String politicalPosition,
        Double specEconomicAxis,
        Double specSocialAxis
) {}
package bg.fmi.polyhub.dto.program;

import lombok.Builder;

@Builder(toBuilder = true)
public record ProgramPolicyDetailsResponse(
        Long id,
        String name,
        String slug,
        String politicalPosition,
        Double specEconomicAxis,
        Double specSocialAxis
) {}
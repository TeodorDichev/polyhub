package bg.fmi.polyhub.dto.program;

import java.util.List;

public record ProgramSuggestion(
        String title,
        String content,
        Double selfEconomicAxis,
        Double selfSocialAxis,
        List<Long> policyIds
) {}
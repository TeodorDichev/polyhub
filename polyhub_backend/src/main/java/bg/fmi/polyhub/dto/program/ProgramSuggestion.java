package bg.fmi.polyhub.dto.program;

import bg.fmi.polyhub.dto.policy.PolicySummary;

import java.util.List;

public record ProgramSuggestion(
        String title,
        String content,
        Double selfEconomicAxis,
        Double selfSocialAxis,
        List<PolicySummary> policies
) {}
package bg.fmi.polyhub.dto.program;

import bg.fmi.polyhub.dto.policy.PolicySummary;

import java.time.LocalDateTime;
import java.util.List;

public record ProgramResponse(
        Long id,
        String title,
        String content,
        Double selfEconomicAxis,
        Double selfSocialAxis,
        Double specEconomicAxis,
        Double specSocialAxis,
        LocalDateTime createdAt,
        LocalDateTime lastEditAt,
        Long electionId,
        String electionName,
        Long partyId,
        String partyName,
        List<PolicySummary> policies
) {}
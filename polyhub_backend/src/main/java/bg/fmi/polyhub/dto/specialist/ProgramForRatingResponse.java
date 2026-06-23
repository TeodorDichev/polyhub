package bg.fmi.polyhub.dto.specialist;

import bg.fmi.polyhub.dto.policy.PolicySummary;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// I wanted to leave this a record, so claude recommended Builder annotation
// Apparently this creates a builder pattern for the class
// The problem was mapping in the service and records are immutable
@Builder(toBuilder = true)
public record ProgramForRatingResponse(
        Long programId,
        String title,
        String content,
        Double selfEconomicAxis,
        Double selfSocialAxis,
        Double specEconomicAxis,
        Double specSocialAxis,
        LocalDateTime createdAt,
        LocalDateTime lastEditAt,
        List<PolicySummary> policies,

        Long electionId,
        String electionName,
        LocalDate electionDate,

        Long partyId,
        String partyName,
        String partyMotto,
        String partyDescription,
        String partyLogoUrl,

        boolean rated,
        boolean electionPassed
) {}
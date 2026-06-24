package bg.fmi.polyhub.dto.party;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder(toBuilder = true)
public record PartyProgramSummaryResponse(
        Long id,
        String title,

        Double selfEconomicAxis,
        Double selfSocialAxis,
        Double specEconomicAxis,
        Double specSocialAxis,

        LocalDateTime createdAt,
        LocalDateTime lastEditAt,

        Long electionId,
        String electionName,
        LocalDate electionDate
) {}
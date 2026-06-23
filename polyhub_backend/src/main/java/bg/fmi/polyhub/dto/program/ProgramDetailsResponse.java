package bg.fmi.polyhub.dto.program;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ProgramDetailsResponse(
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
        LocalDate electionDate,

        Long partyId,
        String partyName,
        String partyDescription,
        String partyMotto,

        List<ProgramPolicyDetailsResponse> policies
) {}
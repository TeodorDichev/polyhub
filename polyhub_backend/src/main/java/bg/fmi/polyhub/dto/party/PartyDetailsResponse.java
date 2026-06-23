package bg.fmi.polyhub.dto.party;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PartyDetailsResponse(
        Long id,
        String name,
        String description,
        String motto,
        String logoUrl,
        LocalDate foundedOn,
        LocalDateTime createdAt,

        Double selfEconomicAxis,
        Double selfSocialAxis,
        Double specEconomicAxis,
        Double specSocialAxis,

        List<PartyProgramSummaryResponse> programs,
        List<PartyElectionParticipationResponse> participations
) {}
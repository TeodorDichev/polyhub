package bg.fmi.polyhub.dto.party;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder(toBuilder = true)
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
        List<PartyElectionParticipationResponse> participations,

        String politicalLabel
) {}
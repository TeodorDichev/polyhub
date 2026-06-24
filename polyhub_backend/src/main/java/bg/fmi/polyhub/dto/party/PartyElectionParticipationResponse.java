package bg.fmi.polyhub.dto.party;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder(toBuilder = true)
public record PartyElectionParticipationResponse(
        Long electionId,
        String electionName,
        LocalDate electionDate,
        String electionType,
        String electionStatus,

        Long votesCount,
        BigDecimal votePercentage,

        Long programId,
        String programTitle
) {}
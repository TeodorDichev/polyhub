package bg.fmi.polyhub.dto.party;

import java.math.BigDecimal;
import java.time.LocalDate;

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
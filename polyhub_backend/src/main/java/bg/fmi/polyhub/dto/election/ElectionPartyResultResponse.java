package bg.fmi.polyhub.dto.election;

import java.math.BigDecimal;

public record ElectionPartyResultResponse(
        Long partyId,
        String partyName,
        String partyDescription,
        String partyMotto,
        Long votesCount,
        BigDecimal votePercentage,
        Long programId,
        String programTitle
) {}
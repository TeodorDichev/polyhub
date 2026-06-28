package bg.fmi.polyhub.dto.specialist;

import java.math.BigDecimal;

public record PartyResultEntry(Long partyId, Long votesCount, BigDecimal votePercentage) {}

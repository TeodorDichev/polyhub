package bg.fmi.polyhub.dto.election;

import lombok.Builder;

import java.math.BigDecimal;

@Builder(toBuilder = true)
public record ElectionPartyResultResponse(
        Long partyId,
        String partyName,
        String partyDescription,
        String partyMotto,

        Double partySelfEconomicAxis,
        Double partySelfSocialAxis,
        Double partySpecEconomicAxis,
        Double partySpecSocialAxis,

        Long votesCount,
        BigDecimal votePercentage,

        Long programId,
        String programTitle,

        Double programSelfEconomicAxis,
        Double programSelfSocialAxis,
        Double programSpecEconomicAxis,
        Double programSpecSocialAxis
) {}
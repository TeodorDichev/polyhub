package bg.fmi.polyhub.dto.election;

import bg.fmi.polyhub.entities.ElectionTypeEnum;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ElectionResponse(
        Long id,
        String name,
        LocalDate electionDate,
        String description,
        ElectionTypeEnum type,
        String status,
        String winnerPartyName,
        BigDecimal winnerVotePercentage
) {}
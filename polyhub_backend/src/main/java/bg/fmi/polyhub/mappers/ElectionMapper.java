package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.entities.Election;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface ElectionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "type", ignore = true)
    Election toEntity(CreateElectionRequest request);

    @Mapping(target = "type", source = "election.type.name")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "winnerPartyName", source = "winnerPartyName")
    @Mapping(target = "winnerVotePercentage", source = "winnerVotePercentage")
    ElectionResponse toResponse(
            Election election,
            String status,
            String winnerPartyName,
            BigDecimal winnerVotePercentage
    );
}
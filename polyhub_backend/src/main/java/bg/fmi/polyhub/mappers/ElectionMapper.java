package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionDetailsResponse;
import bg.fmi.polyhub.dto.election.ElectionPartyResultResponse;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.Program;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.List;

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

    @Mapping(target = "type", source = "election.type.name")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "winnerPartyName", source = "winnerPartyName")
    @Mapping(target = "winnerVotePercentage", source = "winnerVotePercentage")
    @Mapping(target = "parties", source = "parties")
    ElectionDetailsResponse toDetailsResponse(
            Election election,
            String status,
            String winnerPartyName,
            BigDecimal winnerVotePercentage,
            List<ElectionPartyResultResponse> parties
    );

    @Mapping(target = "partyId", source = "participation.party.id")
    @Mapping(target = "partyName", source = "participation.party.name")
    @Mapping(target = "partyDescription", source = "participation.party.description")
    @Mapping(target = "partyMotto", source = "participation.party.motto")
    @Mapping(target = "partySelfEconomicAxis", source = "participation.party.selfEconomicAxis")
    @Mapping(target = "partySelfSocialAxis", source = "participation.party.selfSocialAxis")
    @Mapping(target = "partySpecEconomicAxis", source = "participation.party.specEconomicAxis")
    @Mapping(target = "partySpecSocialAxis", source = "participation.party.specSocialAxis")
    @Mapping(target = "votesCount", source = "participation.votesCount")
    @Mapping(target = "votePercentage", source = "participation.votePercentage")
    @Mapping(target = "programId", source = "program.id")
    @Mapping(target = "programTitle", source = "program.title")
    @Mapping(target = "programSelfEconomicAxis", source = "program.selfEconomicAxis")
    @Mapping(target = "programSelfSocialAxis", source = "program.selfSocialAxis")
    @Mapping(target = "programSpecEconomicAxis", source = "program.specEconomicAxis")
    @Mapping(target = "programSpecSocialAxis", source = "program.specSocialAxis")
    ElectionPartyResultResponse toPartyResultResponse(PartyParticipation participation, Program program);
}

package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.admin.PartyAdminResponse;
import bg.fmi.polyhub.dto.party.PartyDetailsResponse;
import bg.fmi.polyhub.dto.party.PartyElectionParticipationResponse;
import bg.fmi.polyhub.dto.party.PartyProgramSummaryResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.specialist.PartyForRatingResponse;
import bg.fmi.polyhub.entities.Election;
import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.PartyParticipation;
import bg.fmi.polyhub.entities.Program;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PartyMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "rejectionComment", ignore = true)
    @Mapping(target = "selfEconomicAxis", ignore = true)
    @Mapping(target = "selfSocialAxis", ignore = true)
    @Mapping(target = "specEconomicAxis", ignore = true)
    @Mapping(target = "specSocialAxis", ignore = true)
    Party toEntity(SubmitPartyRequest request);

    @Mapping(target = "status", source = "status.name")
    @Mapping(target = "createdByEmail", source = "createdBy.email")
    PartyResponse toResponse(Party party);

    @Mapping(target = "status", source = "status.name")
    @Mapping(target = "createdByEmail", source = "createdBy.email")
    PartyAdminResponse toAdminPartyResponse(Party party);

    @Mapping(target = "rated", ignore = true)
    @Mapping(target = "politicalLabel", ignore = true)
    PartyForRatingResponse toRatingResponseBase(Party party);

    @Mapping(target = "programs", source = "programs")
    @Mapping(target = "participations", source = "participations")
    @Mapping(target = "politicalLabel", ignore = true)
    PartyDetailsResponse toDetailsResponse(Party party, List<PartyProgramSummaryResponse> programs, List<PartyElectionParticipationResponse> participations);

    @Mapping(target = "electionId", source = "program.election.id")
    @Mapping(target = "electionName", source = "program.election.name")
    @Mapping(target = "electionDate", source = "program.election.electionDate")
    PartyProgramSummaryResponse toProgramSummary(Program program);

    @Mapping(target = "electionId", source = "participation.election.id")
    @Mapping(target = "electionName", source = "participation.election.name")
    @Mapping(target = "electionDate", source = "participation.election.electionDate")
    @Mapping(target = "electionType", source = "participation.election.type.name")
    @Mapping(target = "electionStatus", ignore = true)
    @Mapping(target = "votesCount", source = "participation.votesCount")
    @Mapping(target = "votePercentage", source = "participation.votePercentage")
    @Mapping(target = "programId", source = "program.id")
    @Mapping(target = "programTitle", source = "program.title")
    PartyElectionParticipationResponse toParticipationResponse(PartyParticipation participation, Program program);
}

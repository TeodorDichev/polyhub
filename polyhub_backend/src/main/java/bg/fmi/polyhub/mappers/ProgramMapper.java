package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.program.ProgramDetailsResponse;
import bg.fmi.polyhub.dto.program.ProgramPolicyDetailsResponse;
import bg.fmi.polyhub.dto.program.ProgramResponse;
import bg.fmi.polyhub.dto.specialist.ProgramForRatingResponse;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.entities.ProgramPolicy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = PolicyMapper.class
)
public interface ProgramMapper {

    @Mapping(target = "electionId", source = "election.id")
    @Mapping(target = "electionName", source = "election.name")
    @Mapping(target = "partyId", source = "party.id")
    @Mapping(target = "partyName", source = "party.name")
    @Mapping(target = "policies", ignore = true)
    ProgramResponse toResponse(Program program);

    @Mapping(target = "electionId", source = "program.election.id")
    @Mapping(target = "electionName", source = "program.election.name")
    @Mapping(target = "partyId", source = "program.party.id")
    @Mapping(target = "partyName", source = "program.party.name")
    @Mapping(target = "policies", source = "programPolicies")
    ProgramResponse toResponse(Program program, List<ProgramPolicy> programPolicies);

    @Mapping(target = "programId", source = "id")
    @Mapping(target = "electionId", source = "election.id")
    @Mapping(target = "electionName", source = "election.name")
    @Mapping(target = "electionDate", source = "election.electionDate")
    @Mapping(target = "partyId", source = "party.id")
    @Mapping(target = "partyName", source = "party.name")
    @Mapping(target = "partyMotto", source = "party.motto")
    @Mapping(target = "partyDescription", source = "party.description")
    @Mapping(target = "partyLogoUrl", source = "party.logoUrl")
    @Mapping(target = "policies", ignore = true)
    @Mapping(target = "rated", ignore = true)
    @Mapping(target = "electionPassed", ignore = true)
    ProgramForRatingResponse toRatingResponseBase(Program program);

    @Mapping(target = "electionId", source = "program.election.id")
    @Mapping(target = "electionName", source = "program.election.name")
    @Mapping(target = "electionDate", source = "program.election.electionDate")
    @Mapping(target = "partyId", source = "program.party.id")
    @Mapping(target = "partyName", source = "program.party.name")
    @Mapping(target = "partyDescription", source = "program.party.description")
    @Mapping(target = "partyMotto", source = "program.party.motto")
    @Mapping(target = "policies", source = "policies")
    ProgramDetailsResponse toDetailsResponse(Program program, List<ProgramPolicyDetailsResponse> policies);

    @Mapping(target = "id", source = "policy.id")
    @Mapping(target = "name", source = "policy.name")
    @Mapping(target = "slug", source = "policy.slug")
    @Mapping(target = "specEconomicAxis", source = "policy.specEconomicAxis")
    @Mapping(target = "specSocialAxis", source = "policy.specSocialAxis")
    @Mapping(target = "politicalPosition", ignore = true)
    ProgramPolicyDetailsResponse toPolicyDetails(ProgramPolicy programPolicy);

    default Policy toPolicy(ProgramPolicy pp) {
        return pp.getPolicy();
    }
}

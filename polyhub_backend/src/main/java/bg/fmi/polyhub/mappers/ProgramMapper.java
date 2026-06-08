package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.program.ProgramResponse;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.entities.Program;
import bg.fmi.polyhub.entities.ProgramPolicy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = PolicyMapper.class // allows me to use the other mapper, thanks god java/spring devs were smart
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
    ProgramResponse toResponse(
            Program program,
            List<ProgramPolicy> programPolicies
    );

    default Policy toPolicy(ProgramPolicy pp) {
        return pp.getPolicy();
    }
}
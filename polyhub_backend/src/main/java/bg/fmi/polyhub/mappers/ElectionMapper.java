package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.election.CreateElectionRequest;
import bg.fmi.polyhub.dto.election.ElectionResponse;
import bg.fmi.polyhub.entities.Election;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ElectionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "type", ignore = true)
    Election toEntity(CreateElectionRequest request);

    @Mapping(target = "type", source = "type.name")
    ElectionResponse toResponse(Election election);
}
package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.admin.PartyAdminResponse;
import bg.fmi.polyhub.dto.party.SubmitPartyRequest;
import bg.fmi.polyhub.dto.party.PartyResponse;
import bg.fmi.polyhub.dto.specialist.PartyForRatingResponse;
import bg.fmi.polyhub.entities.Party;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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
    PartyForRatingResponse toRatingResponseBase(Party party);
}
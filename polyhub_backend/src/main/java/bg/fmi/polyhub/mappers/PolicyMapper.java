package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.specialist.CreatePolicyRequest;
import bg.fmi.polyhub.dto.policy.PolicySummary;
import bg.fmi.polyhub.entities.Policy;
import bg.fmi.polyhub.dto.PoliticalPositionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface PolicyMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "slug", source = "slug")
    @Mapping(target = "politicalPosition", source = ".", qualifiedByName = "politicalPosition")
    PolicySummary toPolicySummary(Policy policy);

    @Mapping(target = "name", source = "name")
    @Mapping(target = "slug", source = "slug")
    @Mapping(target = "specEconomicAxis", source = "specEconomicAxis")
    @Mapping(target = "specSocialAxis", source = "specSocialAxis")
    Policy toEntity(CreatePolicyRequest request);

    @Named("politicalPosition")
    default String mapPoliticalPosition(Policy policy) {
        PoliticalPositionType type =
                PoliticalPositionType.from(
                        policy.getSpecEconomicAxis(),
                        policy.getSpecSocialAxis()
                );

        return type != null ? type.name() : null;
    }
}
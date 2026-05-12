package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.auth.RegisterRequest;
import bg.fmi.polyhub.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    User toEntity(RegisterRequest request);
}

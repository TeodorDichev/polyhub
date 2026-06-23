package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.dto.auth.RegisterRequest;
import bg.fmi.polyhub.dto.auth.LoggedUser;
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

    @Mapping(target = "role", source = "role.name")
    LoggedUser toLoggedPartyAdmin(User user);

    @Mapping(target = "role", source = "role.name")
    AdminUserResponse toAdminUserResponse(User user);
}

package bg.fmi.polyhub.mappers;

import bg.fmi.polyhub.dto.auth.AuthResponse;
import bg.fmi.polyhub.dto.auth.RegisterRequest;
import bg.fmi.polyhub.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User mapFromDto(RegisterRequest registerDto);

    AuthResponse mapToDto(User user);
}

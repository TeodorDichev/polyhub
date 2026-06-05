package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.partyadmin.LoggedPartyAdmin;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PartyAdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public LoggedPartyAdmin getMe(String email) {
        User user = userRepository
                .findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toLoggedPartyAdmin(user);
    }
}
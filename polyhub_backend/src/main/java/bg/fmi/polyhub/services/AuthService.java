package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.auth.LoginRequest;
import bg.fmi.polyhub.dto.auth.RegisterRequest;
import bg.fmi.polyhub.dto.partyadmin.LoggedPartyAdmin;
import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.entities.UserRole;
import bg.fmi.polyhub.exceptions.UserAlreadyExistsException;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.repositories.UserRepository;
import bg.fmi.polyhub.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.email())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        UserRole role = userRoleRepository
                .findByName(RoleType.PARTY_ADMIN)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);

        userRepository.save(user);
    }

    public LoggedPartyAdmin login(LoginRequest request) {
        User user = userRepository
                .findByEmailAndDeletedAtIsNull(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return userMapper.toLoggedPartyAdmin(user);
    }

    public LoggedPartyAdmin me(String email) {
        User user = userRepository
                .findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toLoggedPartyAdmin(user);
    }
}
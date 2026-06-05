package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.dto.admin.CreateSpecialistRequest;
import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.entities.UserRole;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.repositories.UserRepository;
import bg.fmi.polyhub.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<AdminUserResponse> getAllPartyAdmins() {
        return userRepository.findAllByRoleNameAndDeletedAtIsNull(RoleType.PARTY_ADMIN)
                .stream()
                .map(userMapper::toAdminUserResponse)
                .toList();
    }

    public AdminUserResponse getPartyAdmin(Long id) {
        return userMapper.toAdminUserResponse(findActiveUser(id));
    }

    public AdminUserResponse suspendPartyAdmin(Long id) {
        User user = findActiveUser(id);
        if (user.getSuspendedOn() != null) {
            throw new RuntimeException("User is already suspended");
        }
        user.setSuspendedOn(LocalDateTime.now());
        return userMapper.toAdminUserResponse(userRepository.save(user));
    }

    public AdminUserResponse unsuspendPartyAdmin(Long id) {
        User user = findActiveUser(id);
        if (user.getSuspendedOn() == null) {
            throw new RuntimeException("User is not suspended");
        }
        user.setSuspendedOn(null);
        return userMapper.toAdminUserResponse(userRepository.save(user));
    }

    public void deletePartyAdmin(Long id) {
        User user = findActiveUser(id);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public List<AdminUserResponse> getAllSpecialists() {
        return userRepository.findAllByRoleNameAndDeletedAtIsNull(RoleType.POLYHUB_SPECIALIST)
                .stream()
                .map(userMapper::toAdminUserResponse)
                .toList();
    }

    public AdminUserResponse getSpecialist(Long id) {
        return userMapper.toAdminUserResponse(findActiveUser(id));
    }

    public AdminUserResponse createSpecialist(CreateSpecialistRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        UserRole role = userRoleRepository
                .findByName(RoleType.POLYHUB_SPECIALIST)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setEmail(request.email());
        user.setFirstname(request.firstname());
        user.setLastname(request.lastname());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);

        return userMapper.toAdminUserResponse(userRepository.save(user));
    }

    public void deleteSpecialist(Long id) {
        User user = findActiveUser(id);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    private User findActiveUser(Long id) {
        return userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
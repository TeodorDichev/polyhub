package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.AdminUserPageResponse;
import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.dto.admin.CreateSpecialistRequest;
import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.entities.UserRole;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.repositories.UserRepository;
import bg.fmi.polyhub.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SpecialistService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminUserPageResponse getAllSpecialistsPaged(int page, int size) {
        Page<User> usersPage = userRepository.findAllByRoleNameAndDeletedAtIsNull(
                RoleType.POLYHUB_SPECIALIST,
                PageRequest.of(Math.max(page, 0), normalizePageSize(size), Sort.by("lastname").ascending())
        );
        return new AdminUserPageResponse(
                usersPage.getContent().stream().map(userMapper::toAdminUserResponse).toList(),
                usersPage.getNumber(),
                usersPage.getSize(),
                usersPage.getTotalElements(),
                usersPage.getTotalPages(),
                usersPage.isFirst(),
                usersPage.isLast()
        );
    }

    private int normalizePageSize(int size) {
        return (size == 10 || size == 15 || size == 25) ? size : 10;
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

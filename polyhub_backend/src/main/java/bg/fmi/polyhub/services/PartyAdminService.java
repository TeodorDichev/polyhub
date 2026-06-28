package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.AdminUserPageResponse;
import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PartyAdminService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public AdminUserPageResponse getAllPartyAdminsPaged(int page, int size) {
        Page<User> usersPage = userRepository.findAllByRoleNameAndDeletedAtIsNull(
                RoleType.PARTY_ADMIN,
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

    private User findActiveUser(Long id) {
        return userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
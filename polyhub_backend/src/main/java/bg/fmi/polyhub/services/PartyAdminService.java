package bg.fmi.polyhub.services;

import bg.fmi.polyhub.dto.admin.AdminUserResponse;
import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import bg.fmi.polyhub.mappers.UserMapper;
import bg.fmi.polyhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartyAdminService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

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

    private User findActiveUser(Long id) {
        return userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
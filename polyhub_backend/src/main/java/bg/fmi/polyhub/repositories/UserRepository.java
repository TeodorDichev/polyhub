package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmailAndDeletedAtIsNull(@Email @NotBlank String email);

    Optional<User> findByEmailAndDeletedAtIsNull(@Email @NotBlank String email);

    List<User> findAllByRoleNameAndDeletedAtIsNull(RoleType roleType);

    Page<User> findAllByRoleNameAndDeletedAtIsNull(RoleType roleType, Pageable pageable);

    Optional<User> findByIdAndDeletedAtIsNull(Long id);
}

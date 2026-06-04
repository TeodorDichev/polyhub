package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndDeletedAtIsNull(@Email @NotBlank String email);

    Optional<User> findByEmailAndDeletedAtIsNull(@Email @NotBlank String email);
}

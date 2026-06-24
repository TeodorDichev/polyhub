package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.RoleType;
import bg.fmi.polyhub.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    Optional<UserRole> findByName(RoleType name);
}
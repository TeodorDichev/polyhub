package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findBySlug(String slug);

    List<Policy> findByNameContainingIgnoreCase(String keyword);
}

package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface PartyRepository extends JpaRepository<Party, Long> {

    List<Party> findByStatusName(String status);

    List<Party> findByName(String party);

    boolean existsByName(String name);

    Optional<Party> findByCreatedByAndDeletedAtIsNull(User createdBy);

    boolean existsByNameAndDeletedAtIsNull(String name);

    List<Party> findAllByDeletedAtIsNull();

    Optional<Party> findByIdAndDeletedAtIsNull(Long id);
}

package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.Party;
import bg.fmi.polyhub.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import bg.fmi.polyhub.entities.PartyStatusType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface PartyRepository extends JpaRepository<Party, Long> {

    List<Party> findByName(String party);

    boolean existsByName(String name);

    Optional<Party> findByCreatedByAndDeletedAtIsNull(User createdBy);

    boolean existsByNameAndDeletedAtIsNull(String name);

    List<Party> findAllByDeletedAtIsNull();

    Optional<Party> findByIdAndDeletedAtIsNull(Long id);

    Page<Party> findAllByDeletedAtIsNullAndStatus_Name(
            PartyStatusType status,
            Pageable pageable
    );

    Page<Party> findAllByDeletedAtIsNullAndStatus_NameAndNameContainingIgnoreCase(
            PartyStatusType status,
            String name,
            Pageable pageable
    );
}

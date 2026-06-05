package bg.fmi.polyhub.repositories;

import bg.fmi.polyhub.entities.PartyStatus;
import bg.fmi.polyhub.entities.PartyStatusType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartyStatusRepository extends JpaRepository<PartyStatus, Long> {
    Optional<PartyStatus> findByName(PartyStatusType name);
}